import { Router } from "express"
import { verifyUser } from "../../middlewares/auth.middleware";
import { categoryRequestBodyValidator } from "../../validators/ecommerce/category.validators";
import { validate } from "../../validators/validate";
import { deleteCategory, getCategoryById, updateCategory } from "../../controllers/ecommerce/category.controller";



const router = Router();


router
    .route("/")
    .post(verifyUser,
        categoryRequestBodyValidator(),
        validate,
        createCategory
    )
    .get(getAllCategories);


router
    .route("/:categoryId")
    .get(validate, getCategoryById)
    .delete(verifyUser, validate, deleteCategory)
    .patch(verifyUser, categoryRequestBodyValidator(), validate, updateCategory)