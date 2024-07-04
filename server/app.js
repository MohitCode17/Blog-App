import express from "express";

const app = express();

// TEST API ENDPOINT
app.get("/test", (req, res) => {
  res.send("Server Health OK");
});

export { app };
