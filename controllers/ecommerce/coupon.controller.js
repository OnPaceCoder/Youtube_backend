import { CouponTypeEnum } from "../../constants.js"
import { Coupon } from "../../models/ecommerce/coupon.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js"

const createCoupon = async (req, res, next) => {
    try {
        const { name, couponCode, type = CouponTypeEnum.FLAT,
            discountValue,
            minimumCartValue,
            startDate,
            expiryDate,
        } = req.body;

        const duplicateCoupon = await Coupon.findOne({
            couponCode: couponCode.trim().toUpperCase(),
        })

        if (duplicateCoupon) {
            throw new ApiError(409, "Coupon with code" + duplicateCoupon.couponCode + "already exists")
        }

        if (minimumCartValue && +minimumCartValue < +discountValue) {
            throw new ApiError(400, "Minimum cart value must be greater than or equal to the discount value")
        };

        const coupon = await Coupon.create({
            name,
            couponCode,
            type,
            discountValue,
            minimumCartValue,
            startDate,
            expiryDate,
            owner: req.user._id
        });

        return res.status(201).json(new ApiResponse(201, coupon, "Coupon created successfully"))

    } catch (error) {
        next(error)
    }
}

const applyCoupon = async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
}