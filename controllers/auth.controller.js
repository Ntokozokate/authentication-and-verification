import dotenv from "dotenv";
dotenv.config();

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const doesUserExist = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (doesUserExist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists, go to login" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User successfully added",
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({
      success: false,
      message: "Internal sever error",
    });
  }
};

//user will enter username and password and we will find user by username
//check if the user exists
//with bcrypt take user password from req.body and check it against hashed password in the DB
//if they match we create token(it expires)
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    console.log(user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //create user token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "90m" }
    );

    //Successfully checked and passed tokens then login
    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error logging in user", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//change user password
//this is only for authenticated users only
//1 get user Id(passed fron the auth middleware)

export const changePassword = async (req, res) => {
  try {
    // extract old and new password
    //Cant allow old and new password to be the same

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both new and old passwords",
      });
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "Use a different password from your old password",
      });
    }
    const userId = req.userInfo.userId;
    // find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // compare old password with hashed password stored in the DB
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }
    // hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    //update the new password
    user.password = newHashedPassword;
    await user.save();

    //send success mesage after all is done
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log("Could not change password", error);
    res.status(500).json({
      success: false,
      message: "Password changing failed",
    });
  }
};
