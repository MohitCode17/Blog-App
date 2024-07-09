import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import User from "../models/user.model.js";
import { generateAuthToken } from "../utils/authToken.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";

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
      profilePicture: { url: googlePhotoUrl },
    });

    await newUser.save();
    generateAuthToken(newUser, "Signup successfull", 201, res);
  }
});

// UPDATE PROFILE CONTROLLER
export const handleProfileUpdate = catchAsyncErrors(async (req, res, next) => {
  const updatedData = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  if (req.user.id !== req.params.userId)
    return next(
      new ErrorHandler("You are not allowed to update this user", 403)
    );

  if (updatedData.password) {
    if (updatedData.password.length < 8)
      return next(
        new ErrorHandler("Password must be atleast 8 or more characters")
      );
    updatedData.password = await bcrypt.hash(updatedData.password, 10);
  }

  if (updatedData.username) {
    if (updatedData.username.length < 5 || updatedData.username.length > 20) {
      return next(
        new ErrorHandler("Username must be between 5 and 20 characters", 400)
      );
    }
    if (updatedData.username.includes(" ")) {
      return next(new ErrorHandler("Username cannot contain spaces", 400));
    }
    if (updatedData.username !== updatedData.username.toLowerCase()) {
      return next(new ErrorHandler("Username must be lowercase", 400));
    }
    if (!updatedData.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        new ErrorHandler("Username can only contain letters and numbers", 400)
      );
    }
  }

  if (req.files && req.files.profilePicture) {
    const profilePicture = req.files.profilePicture;

    // UPLOAD AVATAR TO CLOUDINARY
    const uploadProfilePictureResponse = await cloudinary.uploader.upload(
      profilePicture.tempFilePath,
      { folder: "Fintech User Avatar" }
    );

    updatedData.profilePicture = {
      public_id: uploadProfilePictureResponse.public_id,
      url: uploadProfilePictureResponse.url,
    };
  }

  const user = await User.findByIdAndUpdate(req.params.userId, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile Updated",
    user,
  });
});

// HANDLE DELETE PROFILE
export const handleDeleteProfile = catchAsyncErrors(async (req, res, next) => {
  if (req.user.id !== req.params.userId)
    return next(
      new ErrorHandler("You are not allowed to delete this user", 403)
    );

  const user = await User.findById(req.params.userId);
  // PUBLIC ID OF PROFILE PICTURE
  if (user.profilePicture.public_id) {
    const profilePicturePublicId = user.profilePicture?.public_id;
    await cloudinary.uploader.destroy(profilePicturePublicId);
  }

  // DELETE USER
  await User.findByIdAndDelete(req.params.userId);
  res.status(200).json({ success: true, message: "User has been deleted" });
});
