import { isValidObjectId } from "mongoose";
import { Event } from "../models/event.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// // Utility function to check ObjectId validity
// const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Utility function to check event ownership
const checkEventOwnership = (event, userId) => {
  if (event.createdBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to perform this action");
  }
};


const createEvent = asyncHandler(async (req, res) => {
    try {
        const { title, description, category, location, date, registrationDeadline, maxAttendees } = req.body;

        if (![title, description, category, location, date].every(field => field && field.trim())) {
            throw new ApiError(400, "Missing required fields: Title, Description, Category, Location, and Date are required.");
        }

        if (!req.user?._id) {
            throw new ApiError(401, "Unauthorized: Please log in.");
        }

        const createdBy = req.user._id;
        const eventDate = new Date(date);
        const currentDate = new Date();

        if (isNaN(eventDate.getTime())) {
            throw new ApiError(400, "Invalid event date format.");
        }

        if (eventDate < currentDate) {
            throw new ApiError(400, "Event date cannot be in the past.");
        }

        let regDeadlineDate = null;
        if (registrationDeadline) {
            regDeadlineDate = new Date(registrationDeadline);
            if (isNaN(regDeadlineDate.getTime())) {
                throw new ApiError(400, "Invalid registration deadline format.");
            }
            if (regDeadlineDate < currentDate) {
                throw new ApiError(400, "Registration deadline cannot be in the past.");
            }
            if (regDeadlineDate > eventDate) {
                throw new ApiError(400, "Registration deadline cannot be after the event date.");
            }
        }

        const parsedMaxAttendees = maxAttendees && !isNaN(maxAttendees) ? parseInt(maxAttendees, 10) : null;
        if (parsedMaxAttendees !== null && parsedMaxAttendees < 1) {
            throw new ApiError(400, "Max attendees must be a positive number.");
        }

        const eventData = {
            title: title.trim(),
            description: description.trim(),
            category: category.trim().toLowerCase(),
            location: location.trim(),
            date: eventDate,
            registrationDeadline: regDeadlineDate,
            createdBy,
            maxAttendees: parsedMaxAttendees,
        };

        const event = await Event.create(eventData);
        if (!event) {
            throw new ApiError(500, "Event creation failed. Please try again later.");
        }

        return res.status(201).json({
            status: 201,
            message: "Event created successfully.",
            event,
        });

    } catch (error) {
        console.error("Error in createEvent:", error);
        return res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Internal Server Error"));
    }
});




const getAllEvents = asyncHandler(async (req, res) => {
  const { category, location, status, limit = 10, cursor, sortBy = "date", order = "asc" } = req.query;
  const query = {};

  if (category) query.category = category.toLowerCase();
  if (location) query.location = location.trim();
  if (status) query.status = status.trim();

  if (cursor) {
    query._id = { [order === "desc" ? "$lt" : "$gt"]: cursor };
  }

  const sortOrder = order === "desc" ? -1 : 1;

  try {
    const events = await Event.find(query)
      .populate("createdBy", "name email") 
      .select("title category location date createdBy status") 
      .sort({ [sortBy]: sortOrder, _id: sortOrder }) 
      .limit(Number(limit))
      .lean(); 

    const nextCursor = events.length ? events[events.length - 1]._id : null;

    return res.status(200).json(new ApiResponse(200, { events, nextCursor }, "Events fetched successfully"));
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
});



const getEventById = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (!isValidObjectId(eventId)) {
    return res.status(400).json(new ApiError(400, "Invalid Event ID"));
  }

  try {
    const event = await Event.findById(eventId)
      .populate("createdBy", "name email")
      .select("-__v")
      .lean();

    if (!event) {
      return res.status(404).json(new ApiError(404, "Event does not exist"));
    }

    return res.status(200).json(new ApiResponse(200, event, "Event fetched successfully"));
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
});


const updateEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { title, description, category, location, date, maxAttendees, completed } = req.body;

  if (!isValidObjectId(eventId)) {
    return res.status(400).json(new ApiError(400, "Invalid Event ID"));
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json(new ApiError(404, "Event does not exist"));
    }

    checkEventOwnership(event, req.user._id); 

    const restrictedFields = ["attendees", "createdBy"];
    for (const field of restrictedFields) {
      if (req.body[field] !== undefined) {
        return res.status(400).json(new ApiError(400, `Cannot update '${field}' field`));
      }
    }

    if (date && new Date(date) < new Date()) {
      return res.status(400).json(new ApiError(400, "Event date cannot be in the past"));
    }

    if (completed !== undefined && typeof completed !== "boolean") {
      return res.status(400).json(new ApiError(400, "Completed must be a boolean value"));
    }

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (category) updateData.category = category.trim().toLowerCase();
    if (location) updateData.location = location.trim();
    if (date) updateData.date = new Date(date);
    if (maxAttendees) updateData.maxAttendees = Number(maxAttendees);
    if (completed !== undefined) updateData.completed = completed;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    return res.status(200).json(new ApiResponse(200, updatedEvent, "Event updated successfully"));
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
});


const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (!isValidObjectId(eventId)) {
    return res.status(400).json(new ApiError(400, "Invalid Event ID"));
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json(new ApiError(404, "Event does not exist"));
    }

    checkEventOwnership(event, req.user._id); 

    await event.deleteOne();

    return res.status(200).json(new ApiResponse(200, { deletedEvent: event._id }, "Event deleted successfully"));
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
});


// Attend an event
const attendEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (!isValidObjectId(eventId)) {
    return res.status(400).json(new ApiError(400, "Invalid Event ID"));
  }

  try {
    const event = await Event.findById(eventId).select("attendees maxAttendees").lean();
    if (!event) {
      return res.status(404).json(new ApiError(404, "Event does not exist"));
    }

    if (event.attendees.includes(req.user._id.toString())) {
      return res.status(400).json(new ApiError(400, "Already attending this event"));
    }

    if (event.maxAttendees > 0 && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json(new ApiError(400, "Event is full"));
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { attendees: req.user._id } }, 
      { new: true, select: "attendees" }
    ).lean();

    return res.status(200).json(new ApiResponse(200, updatedEvent, "Successfully joined the event"));
  } catch (error) {
    console.error("Error attending event:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
});



// Leave an event
const leaveEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (!isValidObjectId(eventId)) {
    return res.status(400).json(new ApiError(400, "Invalid Event ID"));
  }

  try {
    const event = await Event.findById(eventId).select("attendees").lean();
    if (!event) {
      return res.status(404).json(new ApiError(404, "Event does not exist"));
    }

    if (!event.attendees.includes(req.user._id.toString())) {
      return res.status(400).json(new ApiError(400, "Not attending this event"));
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { attendees: req.user._id } }, 
      { new: true, select: "attendees" }
    ).lean();

    return res.status(200).json(new ApiResponse(200, updatedEvent, "Successfully left the event"));
  } catch (error) {
    console.error("Error leaving event:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
});



const searchEvents = async (req, res) => {
  try {
    let { query, category, location, status, date, page = 1, limit = 10 } = req.query;

    page = Math.max(1, parseInt(page)); 
    limit = Math.max(1, parseInt(limit)); 

    const filter = {};

    if (query) {
      filter.$or = [
        { title: new RegExp(query, "i") }, 
        { description: new RegExp(query, "i") }
      ];
    }

    if (category) filter.category = category;
    if (location) filter.location = location;
    if (status) filter.status = status;
    if (date) filter.date = { $gte: new Date(date) };

    const [events, total] = await Promise.all([
      Event.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ date: 1 })
        .lean(), // Improve performance

      Event.countDocuments(filter) 
    ]);

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Error fetching events" });
  }
};


export {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  attendEvent,
  leaveEvent,
  searchEvents,
};
