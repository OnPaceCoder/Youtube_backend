import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { Like } from "../models/video/like.model.js"
import { Comment } from "../models/video/comment.model.js"
import mongoose from "mongoose"

const toggleVideoLike = async (req, res, next) => {
    //TODO: toggle like on video


    try {
        const { videoId } = req.params

        if (!videoId) {
            throw new ApiError(400, "VideoId is required")
        }


        const existingLike = await Like.findOne({ video: videoId, likedBy: req.user._id });
        if (!existingLike) {
            const newLike = await Like.create({
                video: videoId,
                likedBy: req.user._id
            })
            if (!newLike) {
                throw new ApiError(400, "Unable to like, please try again later.")
            }

            return res.status(200).json(new ApiResponse(200, newLike, "Video Liked"))
        } else {
            const dislike = await Like.findOneAndDelete({ video: videoId, likedBy: req.user._id },
                {
                    new: true
                })

            if (!dislike) {
                throw new ApiError(400, "Unable to dislike, please try again later")
            }

            return res.status(200).json(new ApiResponse(200, dislike, "Video disliked"))
        }
        //Optimised code from chatGPT 
        // const result = await Like.updateOne(
        //     { video: videoId, likedBy: req.user._id },
        //     {
        //         $setOnInsert: {
        //             video: videoId,
        //             likedBy: req.user._id
        //         },
        //         $set: {
        //             video: ""
        //         }
        //     },
        //     { upsert: true, new: true }
        // );
        // if (result.upserted || result.nModified > 0) {
        //     const message = result.upserted ? "Video Liked" : "Video Disliked";
        //     return res.status(200).json(new ApiResponse(200, result, message));
        // } else {
        //     throw new ApiError(400, "Unable to perform like/dislike, please try again later");
        // }

    } catch (error) {
        next(error)
    }



}

const toggleCommentLike = async (req, res) => {
    //TODO: toggle like on comment

    try {
        const { commentId } = req.params

        if (!commentId) {
            throw new ApiError(400, "CommentId is required")
        }


        const existingLike = await Like.findOne({ comment: commentId, likedBy: req.user._id });
        if (!existingLike) {
            const newLike = await Like.create({
                comment: commentId,
                likedBy: req.user._id
            })
            if (!newLike) {
                throw new ApiError(400, "Unable to like, please try again later.")
            }

            return res.status(200).json(new ApiResponse(200, newLike, "Comment Liked"))
        } else {
            const dislike = await Like.findOneAndDelete({ comment: commentId, likedBy: req.user._id },
                {
                    new: true
                })

            if (!dislike) {
                throw new ApiError(400, "Unable to dislike, please try again later")
            }

            return res.status(200).json(new ApiResponse(200, dislike, "Comment disliked"))
        }
    } catch (error) {
        next(error)
    }

}

const toggleTweetLike = async (req, res, next) => {
    //TODO: toggle like on tweet


    try {
        const { tweetId } = req.params
        if (!tweetId) {
            throw new ApiError(400, "TweetId is required")
        }


        const existingLike = await Like.findOne({ tweet: tweetId, likedBy: req.user._id });
        if (!existingLike) {
            const newLike = await Like.create({
                tweet: tweetId,
                likedBy: req.user._id
            })
            if (!newLike) {
                throw new ApiError(400, "Unable to like, please try again later.")
            }

            return res.status(200).json(new ApiResponse(200, newLike, "Tweet Liked"))
        } else {
            const dislike = await Like.findOneAndDelete({ tweet: tweetId, likedBy: req.user._id },
                {
                    new: true
                })

            if (!dislike) {
                throw new ApiError(400, "Unable to dislike, please try again later")
            }

            return res.status(200).json(new ApiResponse(200, dislike, "Tweet disliked"))
        }
    } catch (error) {
        next(error)
    }
}


const getLikedVideos = async (req, res, next) => {
    //TODO: get all liked videos
    try {

        const likedVideos = await Like.aggregate([
            {
                $match: {
                    likedBy: req.user._id,
                    video: { $exists: true },
                }
            },

            {
                $project: {
                    video: 1
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "likedVideoDetails",
                    pipeline: [
                        {
                            $project: {
                                title: 1,
                                description: 1,
                                videoFile: 1,
                                thumbnail: 1,
                                owner: 1
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "ownerDetails",
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
                        },
                    ]

                },

            },

        ])

        if (!likedVideos) {
            throw new ApiError(400, "No liked videos foun")
        }
        return res.status(200).json(new ApiResponse(200, likedVideos, "Liked Videos fetched successfully"))
    } catch (error) {
        next(error)
    }

}

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}