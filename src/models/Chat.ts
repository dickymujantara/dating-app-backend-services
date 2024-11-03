import mongoose, { Document, Schema } from "mongoose";

export interface IChat extends Document {
  _id: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  message: string;
  valid: boolean;
}

const chatSchema = new Schema<IChat>({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  valid: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
