import express from "express";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();

// TEST API ENDPOINT
app.get("/test", (req, res) => {
  res.send("Server Health OK");
});

// ERROR HANDLER MIDDLEWARE
app.use(errorMiddleware);

export { app };
