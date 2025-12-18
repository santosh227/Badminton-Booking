import mongoose from "mongoose";

// connection to mongoDB using mongoose
const connectToMongo = async () => {
  try {
    await mongoose.connect(
      // mongoDB URI from .env =
      process.env.MONGO_URI || "mongodb://localhost:27017/airlinesDB",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    // log success message
    console.log(" MongoDB connected using Mongoose");
  } catch (err) {
    // log error message
    console.error(" MongoDB connection failed:", err);
    // exit process with failure
    process.exit(1);
  }
};
//exporting the function
export default connectToMongo;
