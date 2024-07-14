import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  handleCreateComment,
  handleGetPostComment,
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

export default router;
