import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";
import { attendEvent, createEvent, deleteEvent, getAllEvents, getEventById, leaveEvent, searchEvents, updateEvent } from "../controllers/event.controller.js";
import { createEventValidator, updateEventValidator } from "../validators/event.validators.js";


const router = Router();

router.route("/")
  .get(getAllEvents) 
  .post(verifyJWT, createEventValidator,   createEvent);

router.route("/search").get(searchEvents); 

router.route("/:eventId")
  .get(getEventById)
  .patch(verifyJWT, mongoIdPathVariableValidator("eventId"), updateEventValidator, updateEvent)
  .delete(verifyJWT, mongoIdPathVariableValidator("eventId"), deleteEvent);

router.route("/:eventId/attend").post(verifyJWT, mongoIdPathVariableValidator("eventId"), attendEvent);
router.route("/:eventId/leave").delete(verifyJWT, mongoIdPathVariableValidator("eventId"), leaveEvent);

export default router;
