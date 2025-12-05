import dotenv from "dotenv";
dotenv.config();

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//extract user information from our request body
//check if the user already exists $or method to check if email or username
//to register, hash the password befre storing it into the data base
//create new user to database and save
//return user details side for the password

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
      { expiresIn: "20m" }
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
