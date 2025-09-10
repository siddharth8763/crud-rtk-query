import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpiration: { type: Date },
});

const User = model("User", userSchema);

export default User;
