import mongoose, { Schema } from "mongoose";
import { User } from "../video/user.model.js";
const couponSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        couponCode: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            uppercase: true,
        },
        type: {
            type: String,
            enum: AvailableCouponTypes,
            default: CouponTypeEnum.FLAT
        },
        discountedValue: {
            type: Number,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        minimumCartValue: {
            type: Number,
            default: 0,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        expiryDate: {
            type: Date,
            default: null
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }


    },
    { timestamps: true }
)

export const Coupon = mongoose.model("Coupon", couponSchema)