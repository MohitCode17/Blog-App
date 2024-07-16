import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  handleCreateComment,
  handleEditComment,
  handleGetPostComment,
  handleLikeComment,
} from "../controllers/comment.controllers.js";
const router = express.Router();

// ROUTE: CREATE COMMENT
// PATH: /api/v1/comment/create
// METHOD: POST
router.post("/create", authenticate, handleCreateComment);

// ROUTE: GET COMMENT
// PATH: /api/v1/comment/getPostComment/:postId
// METHOD: GET
router.get("/getPostComment/:postId", handleGetPostComment);

// ROUTE: ADD LIKES COMMENTS
// PATH: /api/v1/comment/likeComment/:commentId
// METHOD: PUT
router.put("/likeComment/:commentId", authenticate, handleLikeComment);

// ROUTE: EDIT COMMENTS
// PATH: /api/v1/comment/editComment/:commentId
// METHOD: PUT
router.put("/editComment/:commentId", authenticate, handleEditComment);

export default router;
