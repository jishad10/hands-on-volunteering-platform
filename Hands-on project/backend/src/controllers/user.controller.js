import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}



const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password, bio, skills, causesSupported, role } = req.body;

    if (![fullName, email, username, password].every(field => field?.trim())) {
        throw new ApiError(400, "All required fields must be provided");
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }

    // handle avatar and cover image upload
    let avatarUrl = null, coverImageUrl = null;
    if (req.files) {
        const avatarPath = req.files.avatar?.[0]?.path;
        const coverImagePath = req.files.coverImage?.[0]?.path;

        if (avatarPath) {
            const uploadedAvatar = await uploadOnCloudinary(avatarPath);
            if (!uploadedAvatar) throw new ApiError(400, "Avatar upload failed");
            avatarUrl = uploadedAvatar.url;
        } else {
            throw new ApiError(400, "Avatar file is required");
        }

        if (coverImagePath) {
            const uploadedCover = await uploadOnCloudinary(coverImagePath);
            coverImageUrl = uploadedCover?.url || "";
        }
    }


    let assignedRole = "user";
    if (role && ["user", "admin"].includes(role)) {
        assignedRole = role;
    }


    let parsedSkills = [];
    let parsedCausesSupported = [];

    try {
        parsedSkills = Array.isArray(skills)
            ? skills.map(skill => skill.trim())
            : JSON.parse(skills); 
    } catch (error) {
        console.error("Error parsing skills:", error);
        parsedSkills = [];
    }

    try {
        parsedCausesSupported = Array.isArray(causesSupported)
            ? causesSupported.map(cause => cause.trim())
            : JSON.parse(causesSupported); 
    } catch (error) {
        console.error("Error parsing causesSupported:", error);
        parsedCausesSupported = [];
    }

    const newUser = await User.create({
        fullName: fullName.trim(),
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password,
        avatar: avatarUrl,
        coverImage: coverImageUrl,
        bio: bio?.trim() || "",
        skills: parsedSkills,
        causesSupported: parsedCausesSupported,
        totalHours: 0,
        points: 0,
        role: assignedRole,
    });

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "User registration failed");
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    console.log("Login Attempt: ", { email, username }); 

    if (!username && !email) {
        console.log("Error: Username or email is required");
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        console.log("Error: User does not exist"); 
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        console.log("Error: Invalid password"); 
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    console.log("User logged in successfully: ", loggedInUser); 

    const options = {
    httpOnly: true,
    secure: false,  // Set to false for local development
    sameSite: "Lax" // Ensures the cookie is sent with frontend requests
};

return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            { user: loggedInUser, accessToken, refreshToken },
            "User logged In Successfully"
        )
    );
});



const logoutUser = asyncHandler(async(req, res) => {
    
    // id find & remove refresh token from db
    // clear cookies
    

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})



const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    // Generate a secure reset token (hashed)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, { resetToken }, "Reset token generated successfully"));
});


const resetPassword = asyncHandler(async (req, res) => {
    const { resetToken, newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) throw new ApiError(400, "Invalid or expired reset token");

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
});




const refreshAccessToken = asyncHandler(async (req, res) => {
    
    // Extract refresh token from cookies or body
    // verify refresh token using jwt
    // user find by id
    // check if refresh token is same as in db
    // generate new access and refresh token
    
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})



const changeCurrentPassword = asyncHandler(async(req, res) => {
    
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})



const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})


const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email, bio, skills, causesSupported, role } = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "Full name and email are required");
    }

    let updateData = {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        bio: bio?.trim() || "",
        skills: Array.isArray(skills) ? skills : JSON.parse(skills || "[]"),
        causesSupported: Array.isArray(causesSupported) ? causesSupported : JSON.parse(causesSupported || "[]"),
    };

    if (req.files?.avatar) {
        const avatar = await uploadOnCloudinary(req.files.avatar[0].path);
        if (avatar) updateData.avatar = avatar.url;
    }

    if (role && ["user", "admin"].includes(role)) {
        updateData.role = role;
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: updateData },
        { new: true }
    ).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});




const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})



const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image updated successfully")
    )
})


const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findById(id).select("-password -refreshToken").lean();
    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});


const getVolunteerHistory = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate({
            path: "volunteerHistory.event",
            select: "title date location", 
        })
        .lean();

    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(new ApiResponse(200, user.volunteerHistory || [], "Volunteer history fetched successfully"));
});




const searchUsers = asyncHandler(async (req, res) => {
    const { skills, causes, hours, fullName, username } = req.query;

    const filters = {};

    if (fullName) {
        filters.fullName = { $regex: new RegExp(fullName, "i") };
    }
    if (username) {
        filters.username = { $regex: new RegExp(username, "i") };
    }
    if (skills) {
        filters.skills = { $in: skills.split(",").map(skill => skill.trim()) };
    }
    if (causes) {
        filters.causesSupported = { $in: causes.split(",").map(cause => cause.trim()) };
    }
    if (hours) {
        const parsedHours = parseInt(hours);
        if (!isNaN(parsedHours) && parsedHours >= 0) {
            filters.totalHours = { $gte: parsedHours };
        }
    }
n
    const users = await User.find(filters).select("-password -refreshToken").lean();

    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});




export {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserById,
    getVolunteerHistory,
    searchUsers
}