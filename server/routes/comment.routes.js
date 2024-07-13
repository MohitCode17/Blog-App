import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { handleCreateComment } from "../controllers/comment.controllers.js";
const router = express.Router();

// ROUTE: CREATE COMMENT
// PATH: /api/v1/comment/create
// METHOD: POST
router.post("/create", authenticate, handleCreateComment);

export default router;
