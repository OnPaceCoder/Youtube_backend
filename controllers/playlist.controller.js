import { Playlist } from "../models/video/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const createPlaylist = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            throw new ApiError(400, "Name and description both are required")
        }

        if (name.trim() === "" || description.trim() === "") {
            throw new ApiError(400, "Name or description is invalid")
        }

        const playlist = await Playlist.create({
            name,
            description,
            owner: req.user?._id,
        })

        if (!playlist) {
            throw new ApiError(400, "Unable to create Playlist, please try again later")
        }

        return res.status(200).json(new ApiResponse(200, playlist, "Playlist created successfully"))

    } catch (error) {
        next(error)
    }
}


const getUserPlaylist = async (req, res, next) => {

    try {
        const userId = req.params.userId

        if (!userId) {
            throw new ApiError(400, "No user Id provided")
        }
        const playlist = await Playlist.find({ owner: userId })

        if (!playlist) {
            throw new ApiError(404, "No playlist found")
        }

        return res.status(200).json(new ApiResponse(200, playlist, "Playlist received"))

    } catch (error) {
        next(error)
    }
}

const getPlaylistById = async (req, res, next) => {

    try {
        const { playlistId } = req.params;

        if (!playlistId) {
            throw new ApiError(400, "Playlist Id not provided")
        }

        const playlist = await Playlist.findById(playlistId)

        if (!playlist) {
            throw new ApiError(404, "No playlist found")
        }

        return res.status(200).json(new ApiResponse(200, playlist, "Playlist received successfully"))
    } catch (error) {
        next(error)
    }
}

const addVideoToPlaylist = async (req, res, next) => {
    try {
        const { videoId, playlistId } = req.params

        if (!videoId || !playlistId) {
            throw new ApiError(400, "Video ID and playlist ID both are required")
        }

        const playlist = await Playlist.findByIdAndUpdate(playlistId, {
            $push: {
                videos: videoId
            },
        }, {
            new: true
        })


        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }

        return res.status(200).json(new ApiResponse(200, playlist, "Playlist updated"))
    } catch (error) {
        next(error)
    }
}

const removeVideoFromPlaylist = async (req, res, next) => {
    try {

        const { videoId, playlistId } = req.params

        if (!videoId || !playlistId) {
            throw new ApiError(400, "Video ID and playlist ID both are required")
        }
        const playlist = await Playlist.findByIdAndUpdate(playlistId, {
            $pull: {
                videos: videoId
            },
        }, {
            new: true
        })


        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }

        return res.status(200).json(new ApiResponse(200, playlist, "Playlist updated"))

    } catch (error) {
        next(error)
    }

}

const deletePlaylist = async (req, res, next) => {
    try {
        const { playlistId } = req.params;

        if (!playlistId) {
            throw new ApiError(400, "Playlist Id not provided")
        }

        const playlist = await Playlist.findByIdAndDelete(playlistId);

        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }
        return res.status(204).json(new ApiResponse(204, playlist, "Playlist deleted"))

    } catch (error) {
        next(error)
    }
}

const updatePlaylist = async (req, res, next) => {
    try {
        const { playlistId } = req.params;
        const { name, description } = req.body;


        if (!name && !description) {
            throw new ApiError(400, "Name or description is required");
        }

        const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
            $set: {
                name,
                description
            }
        },
            {
                new: true
            })

        if (!updatePlaylist) {
            throw new ApiError(404, "Playlist not found and unable to update playlist")
        }
        return res
            .status(200)
            .json(new ApiResponse(200, updatedPlaylist, "Playlist updated Successfully"));





    } catch (error) {
        next(error)
    }


}


export { updatePlaylist, deletePlaylist, createPlaylist, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, getUserPlaylist }