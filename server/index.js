import { app } from "./app.js";

const startServer = () => {
  const port = 8000;

  app.listen(port, () => {
    console.log(`Server running at port: ${port}`);
  });
};

startServer();
