import { Comment } from "../models/video/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse";



const getVideoComments = async (req, res, next) => {
    //Get all comments for a video
    try {
        const { videoId } = req.params
        const { page = 1, limit = 10 } = req.query

        if (!videoId) {
            throw new ApiError(400, "VideoId is required")
        }

        const comments = await Comment.find({ video: videoId }).limit(limit).skip((page - 1) * limit);

        if (!comments) {
            throw new ApiError(404, "No comments found")
        }

        return res.status(200).json(new ApiResponse(200, comments, "Comment fetched successfully"))


    } catch (error) {
        next(error)
    }
}


const addComment = async (req, res, next) => {
    // TODO: add a comment to a video

    try {
        const { content } = req.body;
        const { videoId } = req.params;

        if (!videoId) {
            throw new ApiError(400, "VideoId is required")
        }
        if (content.trim() == "" || !content) {
            throw new ApiError(400, "Comment is required")
        }

        const comment = await Comment.create({
            content,
            video: videoId,
            owner: req.user._id
        })

        if (!comment) {
            throw new ApiError(404, "Unable to comment , please try again later")
        }

        return res.status(200).json(new ApiResponse(200, comment, "Comment successfull"))

    } catch (error) {
        next(error)
    }
}

const updateComment = async (req, res, next) => {
    // TODO: update a comment

    try {
        const { commentId } = req.params;

        const { content } = req.body;


        if (!commentId) {
            throw new ApiError(400, "CommentId is required")
        }
        if (content.trim() == "" || !content) {
            throw new ApiError(400, "Comment is required")
        }

        const updatedComment = await Comment.findByIdAndUpdate(commentId, {
            $set: {
                content
            }
        }, { new: true })

        if (!updateComment) {
            throw new ApiError(404, "Comment not found")
        }

        return res.status(200).json(new ApiResponse(200, updateComment, "Comment updated successfully"))


    } catch (error) {
        next(error)
    }
}

const deleteComment = async (req, res, next) => {
    // TODO: delete a comment

    try {

        const { commentId } = req.params;

        if (!commentId) {
            throw new ApiError(400, "CommentId is required")
        }

        const deletedComment = await Comment.findByIdAndDelete(commentId, { new: true })

        if (!deletedComment) {
            throw new ApiError(404, "Comment not found")
        }

        return res.status(200).json(new ApiResponse(200, deletedComment, "Comment deleted"))

    } catch (error) {
        next(error)
    }


}


export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
