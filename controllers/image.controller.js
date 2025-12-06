import Image from "../models/Image.js";
import fs from "fs/promises";
import { uploadToCloudinary } from "../helpers/cloudinary.helper.js";
import cloudinary from "../config/cloudinary.js";

//we are gettimg the file from frontend
//check if file is missing in request object, log error
//else upload
//import url and publicId from helperfile
//store the image url and public url along with the uploaded user id int the data baseas new data bundle
//then respond with 201 for success
//
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: " File is missing, please upload an image",
      });
    }

    const { url, publicId } = await uploadToCloudinary(req.file.path);
    //cloudinarry uploads the image and returns the url and publicId

    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newlyUploadedImage.save();

    //clear the images in local storage after uploading to cloud
    try {
      await fs.unlink(req.file.path);
    } catch (cleanupError) {
      console.warn("failed to clean local file", cleanupError);
    }

    return res.status(201).json({
      success: true,
      message: " Image upload successful",
      image: newlyUploadedImage,
    });
  } catch (error) {
    console.log("Failed to upload images:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Try again later",
    });
  }
};

// *** only users authenticated can login and fetch or view images
//this route will simply render all images and in the route add authentication and authorization

export const fetchImages = async (req, res) => {
  try {
    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    //sorting
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    //count total documents
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    //build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    //Fetch paginated and sort results
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    //response
    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: totalPages,
      totalImages: totalImages,
      data: images,
    });
  } catch (error) {
    console.error("Could not fetch images:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching images",
    });
  }
};

//get the id of the image you want to delete
export const deleteImage = async (req, res) => {
  try {
    //set variables i will work with

    const imageId = req.params.id;
    const userId = req.userInfo.userId;

    //Find image in DB
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // make sure theuser can only delete their own image
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You can only delete your own images.",
      });
    }
    // delete the image from cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    //now delete image from mongoDB
    await Image.findByIdAndDelete(imageId);

    //send success response
    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Could not delete image:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while deleting image",
    });
  }
};
