import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access Denied, No token provided. " });
  }

  //decode token/ get user information
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log(decodedToken);
    //THE GOLD
    req.userInfo = decodedToken;

    next();
  } catch (error) {
    console.log("Error Authenticating user", error);
    return res.status(401).json({
      success: false,
      message: "Error Authenticating user,Invalid or expired token.",
    });
  }
};
