import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import cloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

// CREATE POST
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

// GET POSTS
export const handleGetPosts = catchAsyncErrors(async (req, res, next) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === "asc" ? 1 : -1;

  const posts = await Post.find({
    ...(req.query.userId && { userId: req.query.userId }),
    ...(req.query.category && { category: req.query.category }),
    ...(req.query.slug && { slug: req.query.slug }),
    ...(req.query.postId && { _id: req.query.postId }),
    ...(req.query.searchTerm && {
      $or: [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ],
    }),
  })
    .sort({ updatedAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const totalPosts = await Post.countDocuments();

  // last month posts
  const now = new Date();

  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  const lastMonthPosts = await Post.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  const user = await User.findById(req.query.userId);

  if (!user) return next(new ErrorHandler("No user found", 404));

  res.status(200).json({
    success: true,
    posts,
    user,
    totalPosts,
    lastMonthPosts,
  });
});

// DELETE POST
export const handleDeletePost = catchAsyncErrors(async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId)
    return next(
      new ErrorHandler("You are not allowed to delete this post", 403)
    );

  const post = await Post.findById(req.params.postId);

  const postImagePublicId = post.postImage?.public_id;
  await cloudinary.uploader.destroy(postImagePublicId);

  await Post.findByIdAndDelete(req.params.postId);
  res.status(200).json({
    success: true,
    message: "Post has been deleted",
  });
});

// UPDATE POST
export const handleUpdatePost = catchAsyncErrors(async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId)
    return next(
      new ErrorHandler("You are not allowed to delete this post", 403)
    );

  const updatedData = {
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
  };

  if (req.files && req.files.postImage) {
    const postImage = req.files.postImage;
    const post = await Post.findById(req.params.postId);

    // GET EXISTING IMAGE PUBLIC ID AND DELETE FROM CLOUDINARY
    const postImagePublicId = post.postImage.public_id;
    await cloudinary.uploader.destroy(postImagePublicId);

    // UPLOAD NEW POST IMAGE TO CLOUDINARY
    const uploadResponseForPostImage = await cloudinary.uploader.upload(
      postImage.tempFilePath,
      { folder: "FinTech Post Banner" }
    );

    updatedData.postImage = {
      public_id: uploadResponseForPostImage.public_id,
      url: uploadResponseForPostImage.url,
    };
  }

  const post = await Post.findByIdAndUpdate(req.params.postId, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Post Updated!",
    post,
  });
});
