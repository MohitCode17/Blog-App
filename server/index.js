import { app } from "./app.js";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";

// ENV CONFIG
config();

const startServer = async () => {
  await connectDB();

  const port = process.env.PORT;

  app.listen(port, () => {
    console.log(`Server running at port: ${port}`);
  });
};

startServer();
