import { Subscription } from "../models/video/subscription.model.js";
import { Video } from "../models/video/video.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getChannelStats = async (req, res, next) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    try {

        const channelStats = await Video.aggregate([
            {
                $match: {
                    owner: req.user._id
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "likedBy",
                    pipeline: [
                        {
                            $project: {
                                likedBy: 1,
                                _id: 0
                            }
                        }
                    ]

                }
            },

            {
                $group: {
                    _id: null,
                    totalVideos: { $sum: 1 },
                    totalViewsOfAllVideos: { $sum: "$views" },
                    totalLikes: {
                        $sum: { $size: "$likedBy" }
                    },


                }
            },
            {
                $project: {
                    totalVideos: 1,
                    totalViewsOfAllVideos: 1,
                    totalLikes: 1,

                }
            }

        ])


        const totalSubscribers = await Subscription.aggregate([
            {
                $match: {
                    channel: req.user._id
                }
            },
            {
                $group: {
                    _id: null,
                    totalSubscribers: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    totalSubscribers: 1,
                    _id: 0
                }
            }
        ])


        channelStats[0] = { ...channelStats[0], ...totalSubscribers[0] }




        if (!totalSubscribers) {
            throw new ApiError(404, "Error occured while counting subscribers")
        }



        if (!channelStats) {
            throw new ApiError(404, "Videos not found")
        }


        return res.status(200).json(new ApiResponse(200, channelStats, "Channel videos fetched successfully"))





    } catch (error) {
        next(error)
    }
}

const getChannelVideos = async (req, res, next) => {
    // TODO: Get all the videos uploaded by the channel

    try {

        const channelVideos = await Video.find({ owner: req.user._id }).select("-videoPublicId -thumbnailPublicId -owner");


        if (!channelVideos) {
            throw new ApiError(404, "Videos not found")
        }


        return res.status(200).json(new ApiResponse(200, channelVideos, "Channel videos fetched successfully"))



    } catch (error) {
        next(error)
    }
}

export {
    getChannelStats,
    getChannelVideos
}