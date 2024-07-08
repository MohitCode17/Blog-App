import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import User from "../models/user.model.js";
import { generateAuthToken } from "../utils/authToken.js";
import bcrypt from "bcryptjs";

// REGISTER CONTROLLER
export const handleRegister = catchAsyncErrors(async (req, res, next) => {
  const { username, email, password } = req.body;

  // VALIDATION

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  )
    return next(new ErrorHandler("All fields are required", 400));

  const userExists = await User.findOne({ username });
  if (userExists) return next(new ErrorHandler("Username already taken"));

  await User.create({
    username,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    message: "Signup successful",
  });
});

// LOGIN CONTROLLER
export const handleLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "")
    return next(new ErrorHandler("All fields are required"));

  const validateUser = await User.findOne({ email }).select("+password");

  if (!validateUser)
    return next(new ErrorHandler("Invalid email or password", 401));

  const isPasswordMatch = await validateUser.comparePassword(password);

  if (!isPasswordMatch)
    return next(new ErrorHandler("Invalid email or password", 401));

  // GENERATE JWT AUTH TOKEN
  generateAuthToken(validateUser, "Login success", 200, res);
});

export const handleGoogleAuth = catchAsyncErrors(async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  // FIND USER WITH EMAIL
  const user = await User.findOne({ email });

  if (user) {
    // IF USER EXISTS THEN GENERATE AUTH TOKEN
    generateAuthToken(user, "Login success", 200, res);
  } else {
    // IF USER DOESN'T EXISTS THEN CREATE NEW USER
    const generatePassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(generatePassword, 10);

    const newUser = new User({
      username:
        name.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4),
      email,
      password: hashedPassword,
      profilePicture: googlePhotoUrl,
    });

    await newUser.save();
    generateAuthToken(newUser, "Signup successfull", 201, res);
  }
});

// UPDATE PROFILE CONTROLLER
export const handleProfileUpdate = catchAsyncErrors(
  async (req, res, next) => {}
);
