import express from "express";
import { isAdmin } from "../middleware/admin.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { uploadImage } from "../controllers/image.controller.js";

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

export default router;
