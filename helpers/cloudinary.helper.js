import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.log("Error uploading to cloudinary", error);
    throw new Error("Error uploading to cloudinary");
  }
};
