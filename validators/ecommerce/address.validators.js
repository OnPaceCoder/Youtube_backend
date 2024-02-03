import { body, param } from "express-validator"

const createAddressValidator = () => {
    return [
        body("addressLine1")
            .trim()
            .notEmpty()
            .withMessage("Address line 1 is required"),
        body("city").trim().notEmpty().withMessage("City is required"),
        body("country").trim().notEmpty().withMessage("Country is required"),
        body("pincode")
            .trim()
            .notEmpty()
            .withMessage("Pincode is required")
            .isNumeric()
            .isLength({ max: 6, min: 6 })
            .withMessage("Invalid pincode"),
        body("state").trim().notEmpty().withMessage("State is required")
    ]
};