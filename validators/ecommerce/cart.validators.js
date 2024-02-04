import { body, param } from 'express-validator'


const addItemOrUpdateItemQuantityValidator = () => {
    return [
        body("qunatity")
            .optional()
            .isInt(
                {
                    min: 1,
                }
            )
            .withMessage("Quantity must be greater than 0")
    ]
}

export { addItemOrUpdateItemQuantityValidator }