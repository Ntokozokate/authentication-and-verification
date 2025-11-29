import Image from "../models/Image.js";
import { uploadToCloudinary } from "../helpers/cloudinary.helper.js";

//we are gettimg the file from frontend
//check if file is missing in request object, log error
//else upload
//import url and publicId from helperfile
//store the image url and public url along with the uploaded user id int the data baseas new data bundle
//then respond with 201 for success

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
    return res.status(201).json({
      success: true,
      message: " Image upload successful",
      image: newlyUploadedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Try again later",
    });
  }
};
