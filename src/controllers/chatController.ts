import { Request, Response } from "express";
import Chat from "../models/Chat";
import ChatRoom from "../models/ChatRoom";
import Swipe from "../models/Swipe";

const getRoomChats = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const chatRooms = await ChatRoom.find({
    $or: [{ userId1: userId }, { userId2: userId }],
    valid: true,
  });

  res.status(201).json(chatRooms);
};

const createChatRoom = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { targetUserId } = req.body;
  const today = new Date().setHours(0, 0, 0, 0);

  const chatRoomExist = await ChatRoom.findOne({
    $or: [
      { userId1: userId, userId2: targetUserId },
      { userId1: targetUserId, userId2: userId },
    ],
    valid: true,
  });

  if (chatRoomExist) {
    res.status(403).json({ message: "Chat room is already exist" });
    return;
  }

  const existingSwipe = await Swipe.findOne({
    userId,
    targetUserId,
    action: "like",
    date: { $gte: today },
  });

  if (!existingSwipe) {
    res.status(404).json({ message: "Swipe History not found" });
    return;
  }

  const matchSwipe = await Swipe.findOne({
    userId: targetUserId,
    targetUserId: userId,
    action: "like",
    date: { $gte: today },
  });

  if (!matchSwipe) {
    res.status(404).json({ message: "Profile Not Match Yet" });
    return;
  }

  const newChatRoom = new ChatRoom({
    userId1: userId,
    userId2: targetUserId,
  });

  await newChatRoom.save();

  res.status(201).json(newChatRoom);
};

const getChat = async (req: Request, res: Response) => {
  const { id } = req.params;

  const chatRoomExist = await ChatRoom.find({
    _id: id,
    valid: true,
  });

  if (!chatRoomExist) {
    res.status(404).json({ message: "Chat room not found" });
    return;
  }

  const chats = await Chat.find({
    _id: id,
    valid: true,
  });

  res.status(201).json(chats);
};

const sendChat = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { id } = req.params;
  const { message } = req.body;

  const chatRoomExist = await ChatRoom.find({
    _id: id,
    valid: true,
  });

  if (!chatRoomExist) {
    res.status(404).json({ message: "Chat room not found" });
    return;
  }

  const newChat = new Chat({
    userId,
    roomId: id,
    message,
  });

  await newChat.save();

  res.status(201).json(newChat);
};

export { getRoomChats, createChatRoom, getChat, sendChat };
