import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/welcome", authMiddleware, isAdmin, (req, res) => {
  //const { username, userId, role } = req.userInfo;
  res.json({
    message: "This is the admin page",
  });
});

export default router;
