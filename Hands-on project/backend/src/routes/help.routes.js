import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, createHelpRequest, deleteHelpRequest, getAllHelpRequests, getHelpRequestById, joinHelpRequest, leaveHelpRequest, updateHelpRequest, updateHelpRequestStatus } from "../controllers/help.controller.js";

const router = Router();

router.get("/", getAllHelpRequests);

router.post("/", verifyJWT, createHelpRequest);

router.route("/:id")
  .get(getHelpRequestById)
  .patch(verifyJWT, updateHelpRequest)
  .delete(verifyJWT, deleteHelpRequest);


router.post("/:id/join", verifyJWT, joinHelpRequest);
router.post("/:id/leave", verifyJWT, leaveHelpRequest);
router.post("/:id/comments", verifyJWT, addComment);

router.patch("/:id/status", verifyJWT, updateHelpRequestStatus);

export default router;
