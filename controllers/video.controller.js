import { Video } from "../models/video/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { deleteOnCloudinary, deleteVideoOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"



const getAllVideos = async (req, res, next) => {
    //TODO: get all videos based on query, sort, pagination

    try {
        const { page = 1, limit = 10, sortBy, sortType, userId } = req.query

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
    // TODO: get video, upload to cloudinary, create video
    try {

        //Get Title , description and duration from req.body
        const { title, description } = req.body;

        if (
            [title, description].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400, "All fields are required");
        }


        //Check if videoFile is uploaded or not
        if (!req.files?.videoFile) {
            throw new ApiError(400, "VideoFile is required")
        }

        const videoPath = req.files?.videoFile[0]?.path

        //Check if thumbnail is uploaded or not
        if (!req.files?.thumbnail) {
            throw new ApiError(400, "Thumbnail is required")
        }

        const thumbnailPath = req.files?.thumbnail[0]?.path;

        const videoFile = await uploadOnCloudinary(videoPath);
        const thumbnail = await uploadOnCloudinary(thumbnailPath);

        if (videoFile == null || thumbnail == null) {
            throw new ApiError(400, "Error occured while uploading video or thumbnail,please try again later")
        }

        const video = await Video.create({
            videoFile: videoFile.secure_url,
            thumbnail: thumbnail.secure_url,
            title,
            description,
            duration: videoFile?.duration || 0,
            videoPublicId: videoFile?.public_id || "",
            thumbnailPublicId: thumbnail?.public_id || "",
            owner: req.user._id
        })

        if (!video) {
            throw new ApiError(400, "Something went wrong while uploading video please try again later")
        }

        return res.status(200).json(new ApiResponse(200, video, "Video uploaded successfully"))

    } catch (error) {
        next(error)
    }


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

        if (req.file?.fieldname === "thumbnail") {
            const thumbnailPath = req.file?.path;

            const oldVideoDetails = await Video.findOne({ _id: videoId, owner: req.user._id });

            if (!oldVideoDetails) {
                throw new ApiError(404, "Video not found or you are not the owner ")
            }
            const oldThumbnailPublicId = oldVideoDetails.thumbnailPublicId;

            const newThumbnail = await uploadOnCloudinary(thumbnailPath);

            if (!newThumbnail) {
                throw new ApiError(400, "Unable to upload new Thumbnail")
            }

            const updatedVideo = await Video.findOneAndUpdate({ _id: videoId, owner: req.user._id }, {
                $set: {
                    title, description,
                    thumbnail: newThumbnail.secure_url,
                    thumbnailPublicId: newThumbnail.public_id
                }
            }, {
                new: true
            })

            if (!updatedVideo) {
                throw new ApiError("Unable to update, please try again later")
            }
            const deleteOldThumbnail = await deleteOnCloudinary(oldThumbnailPublicId);

            if (!deleteOldThumbnail) {
                throw new ApiError(400, "Unable to delete old thumbnail")
            }

            return res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated successfully"))

        }
        else {

            const updatedVideo = await Video.findOneAndUpdate({ _id: videoId, owner: req.user._id }, {
                $set: {
                    title,
                    description,
                }
            }, {
                new: true
            })


            if (!updatedVideo) {
                throw new ApiError(404, "Video not found or you are not the owner")
            }

            return res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated successfully"))
        }


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

        const oldVideoDetails = await Video.findOne({ _id: videoId, owner: req.user._id });

        if (!oldVideoDetails) {
            throw new ApiError(404, "Video not found")
        }

        const oldThumbnailPublicId = oldVideoDetails.thumbnailPublicId;
        const oldVideoPublicId = oldVideoDetails.videoPublicId;



        const video = await Video.findOneAndDelete({ _id: videoId, owner: req.user._id });

        if (!video) {
            throw new ApiError(404, "Video not found")
        }



        const deleteOldVideo = await deleteVideoOnCloudinary(oldVideoPublicId)
        const deleteOldThumbnail = await deleteOnCloudinary(oldThumbnailPublicId);


        if (!deleteOldThumbnail || !deleteOldVideo) {
            throw new ApiError(400, "Unable to delete old thumbnail or video")
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

        const video = await Video.findOne({ _id: videoId, owner: req.user._id }).select("isPublished")

        if (!video) {
            throw new ApiError(400, "Video not found")
        }
        video.isPublished = !video.isPublished;
        await video.save();


        return res.status(200).json(new ApiResponse(200, video, "Status Updated"))
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
