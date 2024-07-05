import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import User from "../models/user.model.js";

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
