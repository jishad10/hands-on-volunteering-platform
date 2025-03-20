import { body } from "express-validator";
import { mongoIdRequestBodyValidator } from "../validators/common/mongodb.validators.js";

const createEventValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("date")
      .notEmpty().withMessage("Date is required")
      .isISO8601().withMessage("Date must be a valid ISO 8601 format")
      .toDate(),
    body("maxAttendees")
      .optional()
      .isNumeric().withMessage("Max attendees must be a number"),
    body("status")
      .optional()
      .isIn(["upcoming", "ongoing", "completed"])
      .withMessage("Status must be 'upcoming', 'ongoing', or 'completed'"),
    ...mongoIdRequestBodyValidator("createdBy"), 
    body("teamOrganizer")
      .optional()
      .isMongoId().withMessage("Invalid Team Organizer ID"),
  ];
};

const updateEventValidator = () => {
  return [
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional().trim().notEmpty().withMessage("Description cannot be empty"),
    body("category").optional().trim().notEmpty().withMessage("Category cannot be empty"),
    body("location").optional().trim().notEmpty().withMessage("Location cannot be empty"),
    body("date")
      .optional()
      .isISO8601().withMessage("Date must be a valid ISO 8601 format")
      .toDate(),
    body("maxAttendees")
      .optional()
      .isNumeric().withMessage("Max attendees must be a number"),
    body("status")
      .optional()
      .isIn(["upcoming", "ongoing", "completed"])
      .withMessage("Status must be 'upcoming', 'ongoing', or 'completed'"),
    body("attendees")
      .optional()
      .isArray().withMessage("Attendees must be an array of user IDs")
      .bail()
      .custom((attendees) => {
        for (const id of attendees) {
          if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error(`Invalid attendee ID: ${id}`);
          }
        }
        return true;
      }),
    body("teamOrganizer")
      .optional()
      .isMongoId().withMessage("Invalid Team Organizer ID"),
  ];
};

export { createEventValidator, updateEventValidator };
