import express from "express";
import { isAdmin } from "../middleware/admin.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {
  deleteImage,
  fetchImages,
  uploadImage,
} from "../controllers/image.controller.js";

const router = express.Router();

// Upload Image Route
// Protected route → user must be logged in

router.post(
  "/upload",
  authMiddleware,
  isAdmin,
  upload.single("image"),
  uploadImage
);
router.get("/get", authMiddleware, fetchImages);

//delete an image route by ID
//69330131c5c8759672d40a76
router.delete("/:id", authMiddleware, isAdmin, deleteImage);

export default router;
