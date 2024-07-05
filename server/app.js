import express from "express";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// TEST API ENDPOINT
app.get("/test", (req, res) => {
  res.send("Server Health OK");
});

// IMPORT ROUTES
import userRoutes from "./routes/user.routes.js";

// ROUTE DECLARATION
app.use("/api/v1/user", userRoutes);

// ERROR HANDLER MIDDLEWARE
app.use(errorMiddleware);

export { app };
