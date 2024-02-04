export const DB_NAME = "videotube"


// User Roles

export const UserRolesEnum = {
    ADMIN: "ADMIN",
    USER: "USER"
};
export const AvailableUserRoles = Object.values(UserRolesEnum)

// Order Enum

export const OrderStatusEnum = {
    PENDING: "PENDING",
    CANCELLED: "CANCELLED",
    DELIVERED: "DELIVERED"
}

export const AvailableOrderStatuses = Object.values(OrderStatusEnum);


// Payment Provider Enum
export const PaymentProviderEnum = {
    UNKNOWN: "UNKNOWN",
    RAZORPAY: "RAZORPAY",
    PAYPAL: "PAYPAL",
};

export const AvailablePaymentProviders = Object.values(PaymentProviderEnum);

// Coupon Types Enum

export const CouponTypeEnum = {
    FLAT: "FLAT"
}

export const AvailableCouponTypes = Object.values(CouponTypeEnum)
