import express from "express";
import {
  getRoomChats,
  createChatRoom,
  getChat,
  sendChat,
} from "../controllers/chatController";

const router = express.Router();

router.get("/rooms", getRoomChats);
router.post("/rooms", createChatRoom);
router.get("/rooms/:id", getChat);
router.post("/rooms/:id", sendChat);

export default router;
