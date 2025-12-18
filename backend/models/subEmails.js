import mongoose, { Schema } from "mongoose";

const subemailSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    groups: [
      {
        groupName: { type: String, required: true },
        emails: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

const Subemails = mongoose.model("Subemails", subemailSchema);
export default Subemails;
