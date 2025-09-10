import { connect } from "mongoose";

export const connectDB = async () => {
  try {
    await connect(process.env.DB_URI);
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1);
  }
};
