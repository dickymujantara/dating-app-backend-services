import mongoose, { Document, Schema } from "mongoose";

export interface IChatRoom extends Document {
  _id: mongoose.Types.ObjectId;
  userId1: mongoose.Types.ObjectId;
  userId2: mongoose.Types.ObjectId;
  valid: boolean;
}

const chatRoomSchema = new Schema<IChatRoom>({
  userId1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userId2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  valid: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;
