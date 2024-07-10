import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { handleWriteBlog } from "../controllers/post.controllers.js";

const router = express.Router();

// ROUTE: WRITE POST
// PATH: /api/v1/post/write
// METHOD: POST
router.post("/write", authenticate, handleWriteBlog);

export default router;
