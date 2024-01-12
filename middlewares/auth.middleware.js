import jwt from "jsonwebtoken"
import { User } from "../models/video/user.model.js"
import { ApiError } from "../utils/ApiError.js"
export const verifyUser = async (req, res, next) => {

    try {

        const token = req.cookies.accessToken

        if (!token) {
            throw new ApiError(401, "Unauthorised request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)


        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Invalid access Token")
        }
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}