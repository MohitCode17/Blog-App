import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import User from "../models/user.model.js";

export const authenticate = catchAsyncErrors(async (req, res, next) => {
  const { access_token } = req.cookies;

  if (!access_token) return next(new ErrorHandler("Unauthorized", 401));

  const decoded = jwt.verify(access_token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);
  next();
});
