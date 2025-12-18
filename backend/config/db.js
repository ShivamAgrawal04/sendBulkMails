import mongoose from "mongoose";

const mongo_url = process.env.MONGO_URI;
if (!mongo_url) {
  console.error("MONGO_URI is not defined in environment variables");
  process.exit(1);
}

const connectToDB = async () => {
  try {
    await mongoose.connect(mongo_url);
    console.log("database connected");
  } catch (error) {
    console.error("database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectToDB;
