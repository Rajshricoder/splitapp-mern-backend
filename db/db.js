import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export const connect = () => {
  console.log("MONGO =", process.env.MONGO);

  mongoose.connect(process.env.MONGO, {
    serverSelectionTimeoutMS: 5000,
    tls: true,
    tlsAllowInvalidCertificates: false,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch(err => {
    console.error("MongoDB Error:", err);
    throw err;
  });
};
