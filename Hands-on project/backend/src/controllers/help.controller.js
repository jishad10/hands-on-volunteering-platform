import { isValidObjectId } from "mongoose";
import { Help } from "../models/help.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllHelpRequests = asyncHandler(async (req, res) => {
  const { urgencyLevel, status } = req.query;
  let filter = {};

  if (urgencyLevel) filter.urgencyLevel = urgencyLevel;
  if (status) filter.status = status;

  const helpRequests = await Help.find(filter).populate("createdBy", "name email");
  res.status(200).json(new ApiResponse(200, helpRequests, "Help requests retrieved successfully"));
});


export const createHelpRequest = asyncHandler(async (req, res) => {
  const { title, description, urgencyLevel } = req.body;
  const userId = req.user.id;

  if (!title || !description || !urgencyLevel) {
    throw new ApiError(400, "All fields are required");
  }

  const newHelpRequest = await Help.create({ title, description, urgencyLevel, createdBy: userId });

  res.status(201).json(new ApiResponse(201, newHelpRequest, "Help request created successfully"));
});


export const getHelpRequestById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid Help Request ID");

  const helpRequest = await Help.findById(id).populate("createdBy", "name email").populate("helpers", "name email");

  if (!helpRequest) throw new ApiError(404, "Help request not found");

  res.status(200).json(new ApiResponse(200, helpRequest, "Help request retrieved successfully"));
});


export const updateHelpRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid Help Request ID");

  const helpRequest = await Help.findById(id);
  if (!helpRequest) throw new ApiError(404, "Help request not found");

  if (helpRequest.createdBy.toString() !== userId) {
    throw new ApiError(403, "You can only update your own help requests");
  }

  Object.assign(helpRequest, req.body);
  await helpRequest.save();

  res.status(200).json(new ApiResponse(200, helpRequest, "Help request updated successfully"));
});


export const deleteHelpRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid Help Request ID");

  const helpRequest = await Help.findById(id);
  if (!helpRequest) throw new ApiError(404, "Help request not found");

  if (helpRequest.createdBy.toString() !== userId) {
    throw new ApiError(403, "You can only delete your own help requests");
  }

  await Help.findByIdAndDelete(id);
  res.status(200).json(new ApiResponse(200, null, "Help request deleted successfully"));
});


export const joinHelpRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid Help Request ID");

  const helpRequest = await Help.findById(id);
  if (!helpRequest) throw new ApiError(404, "Help request not found");

  if (helpRequest.helpers.includes(userId)) {
    throw new ApiError(400, "You have already joined this help request");
  }

  helpRequest.helpers.push(userId);
  await helpRequest.save();

  res.status(200).json(new ApiResponse(200, helpRequest, "Successfully joined help request"));
});


export const leaveHelpRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid Help Request ID");

  const helpRequest = await Help.findById(id);
  if (!helpRequest) throw new ApiError(404, "Help request not found");

  helpRequest.helpers = helpRequest.helpers.filter(helper => helper.toString() !== userId);
  await helpRequest.save();

  res.status(200).json(new ApiResponse(200, helpRequest, "Successfully left help request"));
});


export const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { text } = req.body;

  if (!text) throw new ApiError(400, "Comment text is required");
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid Help Request ID");

  const helpRequest = await Help.findById(id);
  if (!helpRequest) throw new ApiError(404, "Help request not found");

  const comment = { user: userId, text, timestamp: new Date() };
  helpRequest.comments.push(comment);
  await helpRequest.save();

  res.status(200).json(new ApiResponse(200, helpRequest, "Comment added successfully"));
});


export const updateHelpRequestStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  if (!["open", "in-progress", "resolved"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid Help Request ID");

  const helpRequest = await Help.findById(id);
  if (!helpRequest) throw new ApiError(404, "Help request not found");

  if (helpRequest.createdBy.toString() !== userId) {
    throw new ApiError(403, "You can only update your own help requests");
  }

  helpRequest.status = status;
  await helpRequest.save();

  res.status(200).json(new ApiResponse(200, helpRequest, "Help request status updated successfully"));
});
