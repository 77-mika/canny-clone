import mongoose, { Document, Schema } from "mongoose";

export interface IFeedback extends Document {
  title: string;
  body: string;
  image?: string;
  author: mongoose.Types.ObjectId;
  votes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    image: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    votes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Feedback = mongoose.model<IFeedback>("Feedback", feedbackSchema);
export default Feedback;