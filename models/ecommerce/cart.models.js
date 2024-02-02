import mongoose, { Schema } from "mongoose";
import { User } from "../video/user.model.js";
import { Product } from "./product.models.js";
const cartSchema = new Schema({


    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    coupon: {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
        default: null
    },
    items: {
        type: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                    min: [1, "Quantity can not be less then 1."]
                }
            }
        ],
        default: []
    }
},
    { timestamps: true }

)

export const Cart = mongoose.model("Cart", cartSchema)