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

  if (comment.userId !== req.user.id && !req.user.isAdmin)
    return next(new Error("You are not allowed to edit this comment", 403));

  const editComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    { content: req.body.content },
    { new: true }
  );
  res.status(200).json({ success: true, editComment });
});

// DELETE COMMENT
export const handleDeleteComment = catchAsyncErrors(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return next(new ErrorHandler("Comment not found", 404));

  if (comment.userId !== req.user.id && !req.user.isAdmin)
    return next(new Error("You are not allowed to delete this comment", 403));

  await Comment.findByIdAndDelete(req.params.commentId);
  res.status(200).json({ success: true, message: "Comment has been deleted." });
});

// GET ALL COMMENTS
export const handleGetComments = catchAsyncErrors(async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(new ErrorHandler("You are not allowed to get comments", 403));

  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === "asc" ? 1 : -1;

  const comments = await Comment.find()
    .sort({ createdAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const totalComments = await Comment.countDocuments();

  // last month comments
  const now = new Date();

  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  const lastMonthComments = await Comment.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  res.status(200).json({
    success: true,
    comments,
    totalComments,
    lastMonthComments,
  });
});
