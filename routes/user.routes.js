import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    loginUser,
    logoutUser,
    refreshToken,
    registerUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    updatePassword,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),

    registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").get(verifyUser, logoutUser);

router.route("/change-password ").post(verifyUser, updatePassword);

router.route("/current-user").get(verifyUser, getCurrentUser);

router.route("/update-account").post(verifyUser, updateAccountDetails);

router.route("/avatar").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
    ]),
    verifyUser,
    updateAvatar
);

router.route("/cover").post(
    upload.fields([
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    verifyUser,
    updateCoverImage
);

router.route("/refresh-token").post(refreshToken);

router.route("/c/:username").get(getUserChannelProfile)

router.route("/watch-hitory").get(verifyUser, getWatchHistory)

export default router;
