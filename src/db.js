import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL_LOCAL);
  } catch (error) {
    console.log(error);
  }
}

mongoose.connection.once("open", () => {
  console.log("MongoDB connection established");
});

mongoose.connection.on("error", (error) => {
  console.error(error);
});

export default connectDB;
