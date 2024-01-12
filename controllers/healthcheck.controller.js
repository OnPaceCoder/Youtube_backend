import { ApiResponse } from "../utils/ApiResponse.js"

const healthcheck = async (req, res, next) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message

    try {

        return res.status(200).json(new ApiResponse(200, "Active"))
    } catch (error) {
        next(error)
    }
}

export { healthcheck }