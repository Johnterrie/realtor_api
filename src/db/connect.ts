import * as mongoose from "mongoose";

const connectDB = async (url: string) => {
  await mongoose
    .connect(url)
    .then(() => {
      console.log("connected to database");
    })
    .catch(() => {
      console.log("Error connecting to database");
    });
};

export default connectDB;
