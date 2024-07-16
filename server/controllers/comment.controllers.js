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

// LIKE A COMMENT
export const handleLikeComment = catchAsyncErrors(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) return next(new ErrorHandler("Comment not found", 404));

  // Check if comment is already liked or not
  const userIndex = comment.likes.indexOf(req.user.id);

  if (userIndex === -1) {
    comment.numberOfLikes += 1;
    comment.likes.push(req.user.id);
  } else {
    comment.numberOfLikes -= 1;
    comment.likes.splice(userIndex, 1);
  }

  await comment.save();
  res.status(200).json({
    success: true,
    comment,
  });
});

// EDIT COMMENT
export const handleEditComment = catchAsyncErrors(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return next(new ErrorHandler("Comment not found", 404));

  if (comment.userId !== req.user.id || !req.user.isAdmin)
    return next(new Error("You are not allowed to edit this comment", 403));

  const editComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    { content: req.body.content },
    { new: true }
  );
  res.status(200).json({ success: true, editComment });
});
