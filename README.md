# Hands-On Volunteering Platform

## Project Overview
The **Hands-On Volunteering Platform** is a web-based application designed to connect volunteers with meaningful opportunities. It enables users to:

- Register and manage their profiles
- Discover and join volunteer events
- Post and respond to community help requests
- Form teams and collaborate on initiatives
- Track their impact through logged hours and leaderboards

The goal is to create a **collaborative space** that encourages social participation and makes volunteering more accessible and rewarding.

## Technologies Used

### Frontend
- React.js
- Tailwind CSS

### Backend
- Node.js & Express.js
- MongoDB (Mongoose ORM)
- JWT (JSON Web Token) for secure authentication
- Redux for state management

### Other Tools
- Cloudinary for media uploads

## Features

### User Registration & Profile Management
- Secure authentication (signup/login via email and password)
- User profiles include personal details, skills, and supported causes
- Users can edit their profile and track their volunteer history
- User-friendly dashboard to manage activities

### Discover & Join Volunteer Events
- **Event Creation** – Users or organizations can create events with title, description, date, time, location, and category
- **Event Listing & Filtering** – Browse upcoming events and filter by category, location, and availability
- **One-Click Registration** – Instantly join an event and get added to the attendee list
- **Event vs. Post Differentiation** – Events are time-bound, while community help posts are ongoing

### Community Help Requests
- Any user or organization can post a help request
- Other users can offer help via comments or private messaging
- Requests are prioritized by urgency levels (low, medium, urgent)
- A dynamic help request board for better coordination

### Form Teams & Group Initiatives (Bonus Feature)
- Users can create **private or public volunteer teams**
- **Private Teams** – Invite-only, visible only to members
- **Public Teams** – Open to all users, visible on the platform
- Team dashboards displaying members, events, and achievements
- **Leaderboard** showcasing the most active teams

### Impact Tracking & Social Recognition (Bonus Feature)
- **Log Volunteer Hours** – Users can log hours for attended events
- **Verification System** – Auto-verification for platform events; peer verification for external logs
- **Point-Based Rewards** – Users earn **5 points per verified hour**
- **Auto-Generated Certificates** – Earn certificates at **20, 50, and 100 hours**
- **Leaderboard** – Highlights top contributors in the community

## Future Enhancements
- AI-powered event recommendations based on user interests
- Mobile app for on-the-go access
- Social media integration for event sharing

## Database Schema
![Project Diagram](https://raw.githubusercontent.com/jishad10/hands-on-volunteering-platform/main/Hands-on%20project/assets/images/diagram.png)

## Setup Instructions
- download the project npm i
- then config .env file for frontned and backend
- .env file consist mogodb url, cludinary url, access & refresh token , cors origin (for backend)
- .env file consist just backend url (for frontend)

##  API Documentation

# user route
// Public Routes
router.post("/register", 
    upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), 
    registerUser
);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Authenticated Routes
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.get("/current-user", verifyJWT, getCurrentUser);
router.patch("/update-account", 
    verifyJWT, 
    upload.fields([{ name: "avatar", maxCount: 1 }]), 
    updateAccountDetails
);

router.patch("/avatar", verifyJWT, upload.single("avatar"), updateUserAvatar);
router.patch("/cover-image", verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.get("/users/:id", getUserById); 
router.get("/users/:id/history", verifyJWT, getVolunteerHistory); 

router.get("/users/search", searchUsers);

# event route
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

# help route
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


# volunteer route

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

# team route

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







