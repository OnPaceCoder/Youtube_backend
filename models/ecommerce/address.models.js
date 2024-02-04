import mongoose, { Schema } from "mongoose";
import { User } from "../video/user.model.js";

const addressSchema = new Schema({
    addressLine1: {
        required: true,
        type: String,
    },
    addressLine2: {
        type: String,
    },
    city: {
        required: true,
        type: String
    },
    country: {
        required: true,
        type: String
    },
    owner: {
        ref: "User",
        type: Schema.Types.ObjectId
    },
    pincode: {
        type: String,
        required: true
    },
    state: {
        required: true,
        type: String
    }
},
    {
        timestamps: true
    })

export const Address = mongoose.model("Address", addressSchema)