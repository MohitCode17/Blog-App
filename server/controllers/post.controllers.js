import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import cloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";

export const handleWriteBlog = catchAsyncErrors(async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(new ErrorHandler("You are not allowed to create a post", 403));

  const { title, content, category } = req.body;

  if (!title || !content)
    return next(new ErrorHandler("Please provice all required fields", 400));

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  if (!req.files || Object.keys(req.files).length === 0)
    return next(new ErrorHandler("Post image is required", 400));

  const { postImage } = req.files;

  const uploadPostImageRes = await cloudinary.uploader.upload(
    postImage.tempFilePath,
    { folder: "FinTech Post Banner" }
  );

  if (!uploadPostImageRes || uploadPostImageRes.error) {
    console.log(
      "Cloudinary Error:",
      uploadProjectBannerResponse.error || "Unknown cloudinary error"
    );

    return next(
      new ErrorHandler("Failded to upload project banner to cloudinary", 500)
    );
  }

  const newPost = await Post.create({
    title,
    content,
    category,
    slug: slug,
    postImage: {
      public_id: uploadPostImageRes.public_id,
      url: uploadPostImageRes.url,
    },
    userId: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Post created",
    newPost,
  });
});
