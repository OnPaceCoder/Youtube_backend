import { Product } from "../../models/ecommerce/product.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { getMongoosePagniationOptions } from "../../utils/helpers.js";


const getProductById = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);

        if (!product) {
            throw new ApiError(200, product, "Product fetched successfully")
        }
    } catch (error) {
        next(error)
    }
}

const getAllProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const productAggregate = Product.aggregate([{ $match: {} }])

        const products = await Product.aggregatePaginate(
            productAggregate,
            getMongoosePagniationOptions({
                page, limit, customLabels: {
                    totalDocs: "totalProducts",
                    docs: "products"
                }
            })
        )

    } catch (error) {
        next(error)
    }
}




