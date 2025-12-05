import Image from "../models/Image.js";
import fs from "fs/promises";
import { uploadToCloudinary } from "../helpers/cloudinary.helper.js";

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

    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newlyUploadedImage.save();

    //clear the images in local storage after uploading to cloud
    await fs.unlink(req.file.path);

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
    const images = await Image.find({});

    if (images) {
      res.status(200).json({
        success: true,
        message: "Images fetched succesfully",
        data: images,
      });
    }
  } catch (error) {
    console.error("Could not fetch images:", error);
    res.status(500).json({
      success: false,
      message: "Error occured while fetching images",
    });
  }
};
