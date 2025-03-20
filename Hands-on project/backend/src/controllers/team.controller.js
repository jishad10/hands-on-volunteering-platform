import { isValidObjectId } from "mongoose";
import { Team } from "../models/team.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const checkTeamOwnership = (team, userId) => {
  if (team.createdBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to perform this action");
  }
};


const createTeam = asyncHandler(async (req, res) => {
  const { name, description, type } = req.body;
  
  if (!name || !type) {
    throw new ApiError(400, "Name and type are required");
  }

  if (!["private", "public"].includes(type)) {
    throw new ApiError(400, "Invalid team type");
  }

  const existingTeam = await Team.findOne({ name: name.trim() });
  if (existingTeam) {
    throw new ApiError(400, "Team name already exists");
  }

  const team = await Team.create({
    name: name.trim(),
    description: description?.trim() || "",
    type,
    createdBy: req.user._id,
    members: [req.user._id],
  });

  return res.status(201).json(new ApiResponse(201, team, "Team created successfully"));
});


const getAllTeams = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const filter = {};

  if (type && ["private", "public"].includes(type)) {
    filter.type = type;
  }

  const teams = await Team.find(filter).populate("createdBy", "name email").lean();
  return res.status(200).json(new ApiResponse(200, teams, "Teams retrieved successfully"));
});


const getTeamById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid team ID");
  }

  const team = await Team.findById(id).populate("members", "name email").populate("createdBy", "name email").lean();
  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  return res.status(200).json(new ApiResponse(200, team, "Team retrieved successfully"));
});


const updateTeam = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, type } = req.body;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid team ID");
  }

  const team = await Team.findById(id);
  if (!team) {
    throw new ApiError(404, "Team not found");
  }
  checkTeamOwnership(team, req.user._id);

  const updateData = {};
  if (name) updateData.name = name.trim();
  if (description) updateData.description = description.trim();
  if (type && ["private", "public"].includes(type)) updateData.type = type;

  const updatedTeam = await Team.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).lean();
  return res.status(200).json(new ApiResponse(200, updatedTeam, "Team updated successfully"));
});


const deleteTeam = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid team ID");
  }

  const team = await Team.findById(id);
  if (!team) {
    throw new ApiError(404, "Team not found");
  }
  checkTeamOwnership(team, req.user._id);

  await team.deleteOne();
  return res.status(200).json(new ApiResponse(200, { deletedTeam: id }, "Team deleted successfully"));
});


const joinTeam = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid team ID");
  }

  const team = await Team.findById(id);
  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  if (team.members.includes(req.user._id)) {
    throw new ApiError(400, "Already a member of this team");
  }

  team.members.push(req.user._id);
  await team.save();

  return res.status(200).json(new ApiResponse(200, team, "Joined the team successfully"));
});


const leaveTeam = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid team ID");
  }

  const team = await Team.findById(id);
  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  if (!team.members.includes(req.user._id)) {
    throw new ApiError(400, "Not a member of this team");
  }

  team.members = team.members.filter(member => member.toString() !== req.user._id.toString());
  await team.save();

  return res.status(200).json(new ApiResponse(200, team, "Left the team successfully"));
});


const getUserTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({ members: req.user._id }).populate("createdBy", "name email").lean();
  return res.status(200).json(new ApiResponse(200, teams, "User's teams retrieved successfully"));
});

export { createTeam, getAllTeams, getTeamById, updateTeam, deleteTeam, joinTeam, leaveTeam, getUserTeams };