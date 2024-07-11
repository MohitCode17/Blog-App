import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
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

export default router;
