import express from "express";
import { handleRegister } from "../controllers/user.controllers.js";

const router = express.Router();

// ROUTE: REGISTER USER
// PATH: /api/v1/user/register
// METHOD: POST
router.post("/register", handleRegister);

export default router;
