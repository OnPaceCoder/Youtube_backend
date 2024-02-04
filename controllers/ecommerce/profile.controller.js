import { EcomProfile } from "../../models/ecommerce/profile.models"
import { ApiResponse } from "../../utils/ApiResponse"


const getMyEcomProfile = async (req, res, next) => {
    try {

        let profile = await EcomProfile.findOne({
            owner: req.user._id
        })
        return res.status(200).json(new ApiResponse(200, profile, "User profile fetched successfully"))

    } catch (error) {
        next(error)
    }
}

const updateEcomProfile = async (req, res, next) => {
    try {
        const { firstName, lastName, phoneNumber, countryCode } = req.body;

        const profile = await EcomProfile.findOneAndUpdate(
            { owner: req.user._id },
            {
                $set: {
                    firstName,
                    lastName,
                    phoneNumber,
                    countryCode
                }
            },
            {
                new: true
            }
        )
        return res.status(200).json(new ApiResponse(200, profile, "User profile updated successfully"))
    } catch (error) {
        next(error)
    }
}


const getMyOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;


    } catch (error) {
        next(error)
    }
}


export { getMyEcomProfile, updateEcomProfile, getMyOrders }