import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  handleDeletePost,
  handleGetPosts,
  handleWriteBlog,
} from "../controllers/post.controllers.js";

const router = express.Router();

// ROUTE: WRITE POST
// PATH: /api/v1/post/write
// METHOD: POST
router.post("/write", authenticate, handleWriteBlog);

// ROUTE: WRITE POST
// PATH: /api/v1/post/getposts
// METHOD: GET
router.get("/getposts", handleGetPosts);

// ROUTE: DELETE
// PATH: /api/v1/post/delete/:postId/:userId
// METHOD: GET
router.delete("/delete/:postId/:userId", authenticate, handleDeletePost);

export default router;
