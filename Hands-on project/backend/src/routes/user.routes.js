import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateUserAvatar, 
    updateUserCoverImage, 
    updateAccountDetails, 
    getUserById, 
    getVolunteerHistory, 
    forgotPassword, 
    resetPassword, 
    searchUsers 
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

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

export default router;
