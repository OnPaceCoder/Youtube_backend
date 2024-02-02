import mongoose, { Schema } from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderPrice: {
        type: Number,
        required: true,
    },
    discountedOrderPrice: {
        type: Number,
    },
    coupon: {
        type: Schema.Types.ObjectId,
        ref: 'Coupon',
        default: null
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    items: {
        type: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",

                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Quantity can not be less then 1."],
                    default: 1,
                }
            }
        ]
    },

    address: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ['PENDING', 'CANCELLED', 'DELIVERED'],
        default: 'PENDING',
    },
    paymentProvider: {
        type: String,
        enum: AvailablePaymentProviders,
        default: PaymentProviderEnum.UNKNOWN
    },
    paymentId: {
        type: String,
    },
    isPaymentDone: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


export const Order = mongoose.model("Order", orderSchema);