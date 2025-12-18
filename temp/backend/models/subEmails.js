import mongoose, { Schema } from "mongoose";

const emailGroupSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Group name is required"], // Group ka naam zaroori hai
      trim: true,
    },
    emails: {
      type: [String],
      required: true,
      // Emails ko lowercase karne ke liye
      set: (emails) => emails.map((email) => email.toLowerCase()),
      // --- MAIN LOGIC: 500 LIMIT VALIDATOR ---
      validate: {
        validator: function (val) {
          return val.length <= 500; // 500 se zyada allowed nahi
        },
        message:
          "A group cannot have more than 500 emails. Please create a new group.",
      },
    },
  },
  { timestamps: true }
);

// Yeh ensure karega ki ek user ke paas same naam ke 2 groups na hon
// e.g. User1 ke paas do "Marketing" group nahi ho sakte.
emailGroupSchema.index({ user: 1, name: 1 }, { unique: true });

const Subemails =
  mongoose.models?.Subemails || mongoose.model("Subemails", emailGroupSchema);

export default Subemails;
