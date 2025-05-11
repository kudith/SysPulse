import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    email: { type: String }, // opsional
  },
  { timestamps: true }
);

export const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);