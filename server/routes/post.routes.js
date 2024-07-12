import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  handleDeletePost,
  handleGetPosts,
  handleUpdatePost,
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

// ROUTE: UPDATE POST
// PATH: /api/v1/post/update/:postId/:userId
// METHOD: PUT
router.put("/update/:postId/:userId", authenticate, handleUpdatePost);

export default router;
