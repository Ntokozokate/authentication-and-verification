import multer from "multer";
import path from "path";

// --- Storage (files saved in /uploads before Cloudinary upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // local temp folder
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
// --- File Filter (allow images only)
const checkFileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only image files are allowed"), false);
  }

  cb(null, true);
};
export const upload = multer({
  storage: storage,
  fileFilter: checkFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
