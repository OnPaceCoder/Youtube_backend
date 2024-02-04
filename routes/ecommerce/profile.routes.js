import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware";
import { validate } from "../../validators/validate";
import { getMyEcomProfile, getMyOrders, updateEcomProfile } from "../../controllers/ecommerce/profile.controller";

const router = Router();

router.use(verifyUser);

router.route("/").get(getMyEcomProfile).patch(validate, updateEcomProfile);

router.route("/my-orders").get(getMyOrders)