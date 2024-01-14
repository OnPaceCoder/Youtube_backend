import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { Tweet } from "../models/video/tweet.model.js";
import { User } from "../models/video/user.model.js";
import mongoose from "mongoose";

const createTweet = async (req, res, next) => {
    //Todo: Create tweet
    //Check if tweet is empty of not
    //Get the tweet model and save tweet and owner in database 
    //Send tweet successfull message to user with tweet


    try {
        const { content } = req.body;

        if (content?.trim() === "" || !content) {
            throw new ApiError(400, "Tweet is empty ")
        }

        const tweet = await Tweet.create({
            content,
            owner: req.user._id
        })

        if (!tweet) {
            throw new ApiError(404, "Unable to tweet, please try again later")
        }

        res.status(200).json(new ApiResponse(200, tweet, "Tweet Successfull"))


    } catch (error) {
        next(error)
    }
}


const getUserTweets = async (req, res, next) => {

    //Todo: get user tweets

    try {
        const id = req.params.userId;

        const tweets = await Tweet.find({ owner: id });


        if (!tweets) {
            throw new ApiError(404, "No tweets found")
        }

        res.status(200).json(new ApiResponse(200, tweets, "Tweets received!"))
    } catch (error) {
        next(error)
    }
}

const updateTweet = async (req, res, next) => {
    //Todo: update tweet
    //User can update only his tweet and not of other user
    //Check if the owner of the tweet is the logged in user or not 




    try {
        const tweetId = req.params.tweetId;
        const content = req.body.content;

        const tweet = await Tweet.findOneAndUpdate({ _id: tweetId, owner: req.user._id },
            {
                $set: {
                    content
                }
            },
            {
                new: true
            }
        )
        if (!tweet) {
            throw new ApiError(404, "Unable to update please try again later")
        }

        res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"))

    } catch (error) {
        next(error)
    }
}

const deleteTweet = async (req, res, next) => {
    //Todo: delete tweet




    try {
        const tweetId = req.params.tweetId;
        const tweet = await Tweet.findOneAndDelete({ _id: tweetId, owner: req.user._id })

        if (!tweet) {
            throw new ApiError(404, "Unable to delete, Tweet not found")
        }

        res.status(200).json(new ApiResponse(200, tweet, "Tweet deleted successfully"))

    } catch (error) {
        next(error)
    }

}

export {
    createTweet, getUserTweets, updateTweet, deleteTweet
}

