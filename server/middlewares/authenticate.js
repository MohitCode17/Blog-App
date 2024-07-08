import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";

export const authenticate = catchAsyncErrors((req, res, next) => {
  const { access_token } = req.cookies;

  if (!access_token) return next(new ErrorHandler("Unauthorized", 401));

  const decoded = jwt.verify(access_token, process.env.JWT_SECRET_KEY);

  req.user = decoded.id;
  next();
});
