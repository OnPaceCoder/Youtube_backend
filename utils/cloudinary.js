import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

const deleteOnCloudinary = async (publicId) => {
    try {



        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image"
        });

        return result;
    } catch (error) {
        throw new ApiError(400, "Not able to delete old image")
    }
}
const deleteVideoOnCloudinary = async (publicId) => {
    try {



        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'video'
        });

        return result;
    } catch (error) {
        throw new ApiError(400, "Not able to delete old image")
    }
}



const uploadOnCloudinary = async (localFilePath) => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });


        if (!localFilePath) return null;

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })


        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {

        fs.unlinkSync(localFilePath); //Remove the locally saved temp file
        return null;
    }



}

export { uploadOnCloudinary, deleteOnCloudinary, deleteVideoOnCloudinary }