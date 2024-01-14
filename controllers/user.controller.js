import mongoose from "mongoose";
import { User } from "../models/video/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating refresh and access token"
        );
    }
};

const registerUser = async (req, res, next) => {
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    try {
        //Get user details from frontend
        const { fullName, email, username, password } = req.body;

        //Validation - fields should not be empty
        if (
            [fullName, email, username, password].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400, "All fields are required");
        }

        //Check if user already exists by username and email

        const existedUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existedUser) {
            throw new ApiError(409, "User with email or username already exists");
        }

        //Check if avatar is uploaded or not
        if (!req.files?.avatar) {
            throw new ApiError(400, "Avatar is mandatory");
        }
        const avatarLocalPath = req.files?.avatar[0]?.path;

        //Check if "coverImage" file is uploaded which is optional
        let coverImageLocalPath = undefined;

        if (req.files.coverImage && req.files.coverImage.length > 0) {
            coverImageLocalPath = req.files?.coverImage[0]?.path;
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        const user = await User.create({
            fullName,
            username,
            email,
            password,
            avatar: avatar.url,
            avatarPublicId: avatar.public_id,
            coverImage: coverImage?.url || "",
            coverImagePublicId: coverImage?.public_id || "",
        });

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong");
        }

        return res
            .status(201)
            .json(new ApiResponse(200, createdUser, "User registered Successfully"));
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    //send cookie

    try {
        //req body -> data
        const { email, username, password } = req.body;

        //Check username and email
        if (!username && !email) {
            throw new ApiError(400, "Username or Email is required");
        }

        //find the user
        const user = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        //Password check
        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid Credentials");
        }

        //Access and Refresh token
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
            user._id
        );

        const loggedInUser = {
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            watchHistory: user.watchHistory,
            coverImage: user.coverImage ? user.coverImage : "",
            _id: user._id,
        };

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser,
                        accessToken,
                        refreshToken,
                    },
                    "Login Successfull"
                )
            );
    } catch (error) {
        next(error);
    }
};

const logoutUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1,
                },
            },
            {
                new: true,
            }
        );
        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(201)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "Logged Out Succesfully"));
    } catch (error) {
        next(error);
    }
};

const updatePassword = async (req, res, next) => {
    //Get old and new password
    //Check if both fields are provided
    //Check if provided old password is correct
    // Now update old password with new password;
    //Send update password message
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            throw new ApiError(400, "Old and New password is required");
        }

        const user = await User.findById(req.user._id);

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if (!isPasswordCorrect) {
            throw new ApiError(400, "Old Password is Incorrect");
        }

        user.password = newPassword;
        await user.save();

        return res
            .status(200)
            .json(new ApiResponse(200, "Password updated successfully"));
    } catch (error) {
        next(error);
    }
};

const getCurrentUser = async (req, res, next) => {

    const data = await User.aggregate([{
        $match: {
            username: req.user.username
        }
    }, { $limit: 1 }])
    console.log(data)
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current User Details provided successfully"
            )
        );
};

const updateAccountDetails = async (req, res, next) => {
    try {
        const { fullName, email } = req.body;

        if (!fullName || !email) {
            throw new ApiError(400, "All fields are required");
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    fullName,
                    email,
                },
            },
            {
                new: true,
            }
        ).select("-password -refreshToken");

        return res
            .status(200)
            .json(new ApiResponse(200, updatedUser, "User updated Successfully"));
    } catch (error) {
        next(error);
    }
};

const updateAvatar = async (req, res, next) => {
    try {
        //Get oldImage Public Id
        const oldImagePublicId = req.user.avatarPublicId;
        if (!req.files?.avatar) {
            throw new ApiError(400, "Avatar is mandatory to update");
        }

        //Get localPath of file to upload on Cloudinary
        const localPath = req.files?.avatar[0]?.path;

        //Upload on cloudinary using localPath
        const updatedUrl = await uploadOnCloudinary(localPath);

        //Update avatar and avatarPublicId of user in Database and get updated User
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    avatar: updatedUrl.secure_url,
                    avatarPublicId: updatedUrl.public_id,
                },
            },
            { new: true }
        ).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(400, "Failed to change avatar");
        }

        const isDeleted = await deleteOnCloudinary(oldImagePublicId);
        if (!isDeleted) {
            throw new ApiError(400, "Unable to delete old avatar");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, user.coverImage, "Avatar Updated successfully")
            );
    } catch (error) {
        next(error);
    }
};

const updateCoverImage = async (req, res, next) => {
    try {
        //Get oldImageUrl
        const oldImagePublicId = req.user?.coverImagePublicId;

        if (!req.files?.coverImage) {
            throw new ApiError(400, "CoverImage is mandatory to update");
        }
        //Get localPath of file to upload on Cloudinary
        const localPath = req.files?.coverImage[0]?.path;

        //Upload on cloudinary using localPath
        const updatedUrl = await uploadOnCloudinary(localPath);

        //Update avatar of user in Database and get updated User
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    coverImage: updatedUrl.secure_url,
                    coverImagePublicId: updatedUrl.public_id,
                },
            },
            { new: true }
        ).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(400, "Failed to change avatar");
        }

        const isDeleted = await deleteOnCloudinary(oldImagePublicId);
        if (!isDeleted) {
            throw new ApiError(400, "Unable to delete old Cover Image");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, user.coverImage, "Avatar Updated successfully")
            );
    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken

        if (!token) {
            throw new ApiError(400, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)




        const user = await User.findById(decodedToken._id).select("-password ");

        if (!user) {
            throw new ApiError(401, "Invalid refresh Token")
        }
        if (token !== user.refreshToken) {
            throw new ApiError(400, "Refresh Token not Valid or expired")
        }

        //Access and Refresh token
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
            user._id
        );

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {

                        accessToken,
                        refreshToken: refreshToken,
                    },
                    "Access Token refreshed"
                )
            );
    } catch (error) {
        next(error)
    }
}

const getUserChannelProfile = async (req, res, next) => {
    try {

        const { username } = req.params


        if (!username?.trim()) {
            throw new ApiError(400, "Username is missing")
        }


        const channel = await User.aggregate([

            {
                $match: { username: username?.toLowerCase() }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers"

                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribedTo"
                }
            },
            {
                $addFields: {
                    subscriberCount: {
                        $size: "$subscribers"
                    },
                    channelsSubscribedToCount: {
                        $size: "$subscribedTo"
                    },
                    isSubscribed: {
                        $cond: {
                            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    fullName: 1,
                    username: 1,
                    subscribersCount: 1,
                    channelsSubscribedToCount: 1,
                    isSubscribed: 1,
                    avatar: 1,
                    coverImage: 1,
                    email: 1

                }
            }

        ])

        if (!channel?.length) {
            throw new ApiError(404, "Channel does not exists")
        }

        return res.status(200, channel[0], "User channel fetched successfully")

    } catch (error) {
        next(error)
    }
}


const getWatchHistory = async (req, res, next) => {
    try {


        const user = await User.aggregate([

            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.user._id)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "watchHistory",
                    foreignField: "_id",
                    as: "watchHistory",

                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",

                                pipeline: [
                                    {
                                        $project: {
                                            fullName: 1,
                                            username: 1,
                                            avatar: 1
                                        }
                                    }
                                ]
                            }
                        }
                    ]

                }
            },
            {
                $addFields: {
                    owner: {
                        $first: "owner"
                    }
                }
            }

        ])



        return res.status(200).json(new ApiResponse(200, user[0].watchHistory, "Watch history fetched successfully"))









    } catch (error) {
        next(error)
    }
}


export {
    registerUser,
    loginUser,
    logoutUser,
    updatePassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    refreshToken,
    getUserChannelProfile,
    getWatchHistory
};
