import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import Comment from "../models/comment.model.js";

export const handleCreateComment = catchAsyncErrors(async (req, res, next) => {
  const { content, postId, userId } = req.body;

  if (userId !== req.user.id)
    next(new ErrorHandler("You are not allowed to create a comment", 403));

  const newComment = await Comment.create({
    content,
    userId,
    postId,
  });

  res.status(201).json({
    success: true,
    newComment,
  });
});

// GET POST COMMENT
export const handleGetPostComment = catchAsyncErrors(async (req, res, next) => {
  const comments = await Comment.find({ postId: req.params.postId }).sort({
    createdAt: -1,
  });
  res.status(200).json({
    success: true,
    comments,
  });
});
