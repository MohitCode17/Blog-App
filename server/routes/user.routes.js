import express from "express";
import {
  handleGoogleAuth,
  handleLogin,
  handleProfileUpdate,
  handleRegister,
} from "../controllers/user.controllers.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// ROUTE: REGISTER USER
// PATH: /api/v1/user/register
// METHOD: POST
router.post("/register", handleRegister);

// ROUTE: LOGIN USER
// PATH: /api/v1/user/login
// METHOD: POST
router.post("/login", handleLogin);

// ROUTE: GOOGLE OAUTH
// PATH: /api/v1/user/googleAuth
// METHOD: POST
router.post("/googleAuth", handleGoogleAuth);

// ROUTE: UPDATE PROFILE
// PATH: /api/v1/user/update/:userId
// METHOD: PUT
router.put("/update/:userId", authenticate, handleProfileUpdate);

export default router;
