import { isValidObjectId } from "mongoose";
import { VolunteerLog } from "../models/volunteerLog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const logVolunteerHours = asyncHandler(async (req, res) => {
  const { event, hours } = req.body;
  const userId = req.user.id;

  if (!isValidObjectId(event)) {
    throw new ApiError(400, "Invalid event ID");
  }
  
  const volunteerLog = new VolunteerLog({
    user: userId,
    event,
    hours,
    verified: false, 
    peerVerifications: [],
  });

  await volunteerLog.save();

  res.status(201).json(new ApiResponse(201, volunteerLog, "Volunteer hours logged successfully"));
});


export const getAllVolunteerLogs = asyncHandler(async (req, res) => {
  const logs = await VolunteerLog.find().populate("user event");

  res.status(200).json(new ApiResponse(200, logs, "Volunteer logs fetched successfully"));
});


export const getUserVolunteerLogs = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const logs = await VolunteerLog.find({ user: userId }).populate("event");

  res.status(200).json(new ApiResponse(200, logs, "User volunteer logs fetched successfully"));
});


export const getVolunteerLog = asyncHandler(async (req, res) => {
  const { logId } = req.params;

  if (!isValidObjectId(logId)) {
    throw new ApiError(400, "Invalid log ID");
  }

  const log = await VolunteerLog.findById(logId)
    .populate("user", "name email")
    .populate("event");

  if (!log) {
    throw new ApiError(404, "Volunteer log not found");
  }

  res.status(200).json(new ApiResponse(200, log, "Volunteer log details fetched successfully"));
});


export const verifyVolunteerLog = asyncHandler(async (req, res) => {
  const { logId } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  if (!isValidObjectId(logId)) {
    throw new ApiError(400, "Invalid log ID");
  }

  const volunteerLog = await VolunteerLog.findById(logId);
  if (!volunteerLog) {
    throw new ApiError(404, "Volunteer log not found");
  }

  // Check if user has already verified
  const existingVerification = volunteerLog.peerVerifications.find(
    (verification) => verification.user.toString() === userId
  );

  if (existingVerification) {
    throw new ApiError(400, "You have already verified this log");
  }

  // Add verification
  volunteerLog.peerVerifications.push({ user: userId, status });

  // Auto-approve if at least 2 peers approve
  const approvedCount = volunteerLog.peerVerifications.filter(v => v.status === "approved").length;
  if (approvedCount >= 2) {
    volunteerLog.verified = true;
  }

  await volunteerLog.save();
  
  res.status(200).json(new ApiResponse(200, volunteerLog, "Volunteer log verified successfully"));
});


export const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await VolunteerLog.aggregate([
    { $match: { verified: true } },
    { $group: { _id: "$user", totalHours: { $sum: "$hours" } } },
    { $sort: { totalHours: -1 } },
    { $limit: 10 },
  ]);

  res.status(200).json(new ApiResponse(200, leaderboard, "Leaderboard fetched successfully"));
});


export const getCertificates = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const totalHours = await VolunteerLog.aggregate([
    { $match: { user: userId, verified: true } },
    { $group: { _id: "$user", totalHours: { $sum: "$hours" } } },
  ]);

  const hours = totalHours.length ? totalHours[0].totalHours : 0;
  let certificates = [];

  if (hours >= 20) certificates.push("Volunteer Bronze Badge");
  if (hours >= 50) certificates.push("Volunteer Silver Badge");
  if (hours >= 100) certificates.push("Volunteer Gold Badge");

  res.status(200).json(new ApiResponse(200, { hours, certificates }, "Certificates fetched successfully"));
});
