import { Router } from "express";
import { verifyJWT  } from "../middlewares/auth.middleware.js";
import { 
  logVolunteerHours, 
  getAllVolunteerLogs, 
  getUserVolunteerLogs, 
  getVolunteerLog, 
  verifyVolunteerLog, 
  getLeaderboard, 
  getCertificates 
} from "../controllers/volunteer.controller.js";

const router = Router();

router.post("/log", verifyJWT, logVolunteerHours);

router.get("/logs", verifyJWT, getAllVolunteerLogs);

router.get("/my-logs", verifyJWT, getUserVolunteerLogs);

router.get("/log/:logId", verifyJWT, getVolunteerLog);

router.post("/verify/:logId", verifyJWT, verifyVolunteerLog);

router.get("/leaderboard", getLeaderboard);

router.get("/certificates", verifyJWT, getCertificates);

export default router;
