import { Video } from "../models/video/video.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getChannelStats = async (req, res, next) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    try {


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