const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImageCloudinary = async (image) => {
    try {
        console.log("Uploading image to Cloudinary...");
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "blinkit" },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        reject(error);
                    } else {
                        console.log("Cloudinary upload result:", result);
                        resolve(result);
                    }
                }
            );
            stream.end(Buffer.from(image.buffer));
        });
        return uploadResult;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw new Error("Cloudinary upload error: " + error.message);
    }
};

module.exports = uploadImageCloudinary;
