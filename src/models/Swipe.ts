import mongoose, { Document, Schema } from "mongoose";

export interface ISwipe extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  targetUserId: mongoose.Types.ObjectId;
  action: string;
  date: Date;
}

const swipeSchema = new Schema<ISwipe>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: { type: String, enum: ["like", "pass"], required: true },
  date: { type: Date, default: Date.now },
});

const Swipe = mongoose.model("Swipe", swipeSchema);

export default Swipe;
