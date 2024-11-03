import express from "express";
import {
  getUser,
  userCandidates,
  swipeCandidate,
  swipeHistory,
  purchasePremium,
  cancelPremium,
  getCandidate,
} from "../controllers/userController";

const router = express.Router();

router.get("/me", getUser);
router.get("/candidates", userCandidates);
router.get("/candidates/view/:id", getCandidate);
router.post("/candidates/swipe", swipeCandidate);
router.get("/candidates/swipe/history", swipeHistory);
router.post("/premium/purchase", purchasePremium);
router.post("/premium/cancel", cancelPremium);

export default router;
