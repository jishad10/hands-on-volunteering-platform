import { Router } from "express";
import { createTeam, deleteTeam, getAllTeams, getTeamById, joinTeam, leaveTeam, updateTeam, getUserTeams } from "../controllers/team.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
    .post("/", verifyJWT, createTeam)
    .get("/", getAllTeams);


router.get("/:id", getTeamById);

router.patch("/:id", verifyJWT, updateTeam);

router.delete("/:id", verifyJWT, deleteTeam);

router.post("/:id/join", verifyJWT, joinTeam);

router.post("/:id/leave", verifyJWT, leaveTeam);

router.get("/my-teams", verifyJWT, getUserTeams);

export default router;
