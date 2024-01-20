import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import { verifyUser } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyUser);

router
    .route("/c/:channelId")
    .post(toggleSubscription);

router.route("/c/:subscriberId").get(getSubscribedChannels)
router.route("/u/:channelId").get(getUserChannelSubscribers);

export default router