import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  fullName: { type: String, lowercase: true },
  userEmail: { type: String, lowercase: true, unique: true },
  password: { type: String },

  emailAccounts: [
    {
      email: { type: String, lowercase: true },
      googleAppPassword: { type: String },
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
