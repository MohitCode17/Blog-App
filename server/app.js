import express from "express";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import { config } from "dotenv";
config();

const app = express();

// CORS CONFIG
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// FILE UPLOAD MIDDLEWARE
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

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
