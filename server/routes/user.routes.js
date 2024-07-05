import express from "express";
import {
  handleLogin,
  handleRegister,
} from "../controllers/user.controllers.js";

const router = express.Router();

// ROUTE: REGISTER USER
// PATH: /api/v1/user/register
// METHOD: POST
router.post("/register", handleRegister);

// ROUTE: LOGIN USER
// PATH: /api/v1/user/login
// METHOD: POST
router.post("/login", handleLogin);

export default router;
