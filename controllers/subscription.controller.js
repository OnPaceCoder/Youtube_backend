import mongoose from "mongoose";
import { Subscription } from "../models/video/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleSubscription = async (req, res, next) => {
    // TODO: toggle subscription

    try {
        const { channelId } = req.params


        if (!channelId) {
            throw new ApiError(400, "ChannelId is required")
        }


        const existingSubscription = await Subscription.findOne({ channel: channelId, subscriber: req.user._id });


        if (!existingSubscription) {


            const newSubscription = await Subscription.create({
                channel: channelId,
                subscriber: req.user._id
            })
            if (!newSubscription) {
                throw new ApiError(400, "Unable to subscribe, please try again later.")
            }

            return res.status(200).json(new ApiResponse(200, newSubscription, "Channel Subscribed"))
        } else {
            const unSubscribe = await Subscription.findOneAndDelete({ channel: channelId, subscriber: req.user._id },
                {
                    new: true
                })

            if (!unSubscribe) {
                throw new ApiError(400, "Unable to Unsubscribe, please try again later")
            }

            return res.status(200).json(new ApiResponse(200, unSubscribe, "Channel Unsubscribed"))
        }

    } catch (error) {
        next(error)
    }
}

// controller to return subscriber list of a channel
const getUserChannelSubscribers = async (req, res, next) => {

    try {
        const { channelId } = req.params

        const subscriberList = await Subscription.aggregate([
            {
                $match: {
                    channel: new mongoose.Types.ObjectId(channelId)
                }
            }, {
                $project: {
                    subscriber: 1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "subscriber",
                    foreignField: "_id",
                    as: "Subscribers",

                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                email: 1,
                                fullName: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            }
        ])

        if (!subscriberList) {
            throw new ApiError(400, "Subscribers not found")
        }

        return res.status(200).json(new ApiResponse(200, subscriberList, "Subscribers fetched successfully"))

    } catch (error) {
        next(error)
    }
}
// controller to return channel list to which user has subscribed
const getSubscribedChannels = async (req, res, next) => {

    try {
        const { subscriberId } = req.params
        // const channels = await Subscription.find({ subscriber: subscriberId });
        const channelList = await Subscription.aggregate([
            {
                $match: {
                    subscriber: new mongoose.Types.ObjectId(subscriberId)
                },

            },
            {
                $project: {
                    channel: 1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "channel",
                    foreignField: "_id",
                    as: "channelDetails",

                    pipeline: [
                        {

                            $project: {
                                username: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            }
        ])

        return res.status(200).json(new ApiResponse(200, channelList, "Channels fetched successfully"))
    } catch (error) {
        next(error)
    }
}

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}