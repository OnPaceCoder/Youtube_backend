import { Video } from "../models/video/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"



const getAllVideos = async (req, res, next) => {
    //TODO: get all videos based on query, sort, pagination

    try {
        const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

        const videos = await Video.find({ owner: userId }).limit(limit).skip((page - 1) * limit).sort({ [sortBy]: sortType })

        if (!videos) {
            throw new ApiError(404, "Videos not found");
        }

        return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"))
    } catch (error) {
        next(error)
    }



}

const publishAVideo = async (req, res, next) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
}

const getVideoById = async (req, res, next) => {

    try {
        const { videoId } = req.params;


        if (!videoId) {
            throw new ApiError(400, "VideoId is requried");


        }

        const video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(404, "Video not found")
        }

        return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"))

    } catch (error) {
        next(error)
    }



}

const updateVideo = async (req, res, next) => {
    //TODO: update video details like title, description, thumbnail -- Remaining

    try {
        const { videoId } = req.params
        const { title, description } = req.body;
        if (!videoId) {
            throw new ApiError(400, "VideoId is requried");
        }

        const updatedVideo = await Video.findByIdAndUpdate(videoId, {
            $set: {
                title,
                description,

            }
        }, {
            new: true
        })

        if (!updateVideo) {
            throw new ApiError(404, "Video not found")
        }

        return res.status(200).json(new ApiResponse(200, updateVideo, "Video updated successfully"))

    } catch (error) {
        next(error)
    }

}

const deleteVideo = async (req, res, next) => {
    try {
        const { videoId } = req.params


        if (!videoId) {
            throw new ApiError(400, "VideoId is required");
        }
        const video = await Video.findByIdAndDelete(videoId);

        if (!video) {
            throw new ApiError(404, "Video not found")
        }

        return res.status(204).json(new ApiResponse(204, video, "Video Deleted"))
    } catch (error) {
        next(error)
    }
}

const togglePublishStatus = async (req, res, next) => {

    try {
        const { videoId } = req.params
        if (!videoId) {
            throw new ApiError(400, "VideoId is required");
        }

        const video = await Video.findById(videoId).select("isPublished")


        const updateVideoStatus = await Video.findByIdAndUpdate(videoId, {
            $set: {
                isPublished: { $ne: ["$isPublished", true] }
            }
        }, {
            new: true
        })

        if (!updateVideoStatus) {
            throw new ApiError(404, "Video not found and unable to update")
        }

        return res.status(204).json(new ApiResponse(204, updateVideoStatus, "Status Updated"))
    } catch (error) {
        next(error)
    }
}

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
