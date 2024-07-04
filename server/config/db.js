import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully !!");
    });

    mongoose.connection.on("error", (err) => {
      console.log(`Error in connecting with database: ${err}`);
    });

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log("Failed to connect with database", error);
    process.exit(1);
  }
};
