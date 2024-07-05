import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import User from "../models/user.model.js";
import { generateAuthToken } from "../utils/authToken.js";

// REGISTER CONTROLLER
export const handleRegister = catchAsyncErrors(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  )
    return next(new ErrorHandler("All fields are required", 400));

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
