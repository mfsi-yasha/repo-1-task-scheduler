import mongoose from "mongoose";
import KEYS from "src/globals/keys";

mongoose
  .connect(KEYS.MONGO_KEYS.MONGODB_SERVER)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((e) => {
    console.log("MongoDB connection error");
    console.error(e);
  });
