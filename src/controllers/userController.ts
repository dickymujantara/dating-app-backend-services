import { Request, Response } from "express";
import User from "../models/User";
import Swipe from "../models/Swipe";

const getUser = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const user = await User.findById(userId, "name email");

  if (!user) {
    res.status(400);
  }

  res.status(200).json(user);
};

const userCandidates = async (req: Request, res: Response) => {
  const today = new Date().setHours(0, 0, 0, 0);

  const swipedProfilesToday = await Swipe.find({
    userId: req.user._id,
    date: { $gte: today },
  }).select("targetUserId");

  const swipedProfileIds = swipedProfilesToday.map((swipe) =>
    swipe.targetUserId.toString()
  );

  const candidates = await User.find({
    _id: { $nin: [...swipedProfileIds, req.user._id.toString()] },
    valid: true,
  }).limit(10);

  res.send(candidates);
};

const getCandidate = async (req: Request, res: Response) => {
  const { id } = req.params;

  const candidate = await User.findOne({
    _id: id,
    valid: true,
  });

  if (!candidate) {
    res.status(404).send({ message: "Candidate not found" });
    return;
  }

  res.send(candidate);
};

const swipeCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { targetUserId, action } = req.body;
    const today = new Date().setHours(0, 0, 0, 0);

    // Check if the user is trying to swipe their own profile
    if (req.user._id.toString() === targetUserId) {
      res.status(400).send({ message: "You cannot swipe your own profile." });
      return;
    }

    // Check if the target user swipe to avoid double swipe
    const existingSwipe = await Swipe.findOne({
      userId: req.user._id,
      targetUserId,
      date: { $gte: today },
    });

    if (existingSwipe) {
      res.status(400).send({ message: "Profile already swiped today" });
      return;
    }

    // Count swipes in a day
    const dailySwipeCount = await Swipe.countDocuments({
      userId: req.user._id,
      date: { $gte: today },
    });

    const user = await User.findById(req.user._id);

    // Check premium account and swipe count
    if (!user.premium && dailySwipeCount >= 10) {
      res.status(403).send({ message: "Daily swipe limit reached" });
      return;
    }

    // Create and save a new swipe
    const newSwipe = new Swipe({
      userId: req.user._id,
      targetUserId,
      action,
    });
    await newSwipe.save();

    res.send({ message: `Profile ${action === "like" ? "liked" : "passed"}` });
  } catch (error) {
    console.error("Error in swipeCandidate:", error);
    res
      .status(500)
      .send({ message: "An error occurred while processing your request." });
    return;
  }
};

const swipeHistory = async (req: Request, res: Response) => {
  const today = new Date().setHours(0, 0, 0, 0);

  const swipesToday = await Swipe.find({
    userId: req.user._id,
    date: { $gte: today },
  }).populate("targetUserId");

  const targetUserIds = swipesToday.map((swipe) => swipe.targetUserId);

  const matchedSwipes = await Swipe.find({
    userId: { $in: targetUserIds },
    targetUserId: req.user._id,
    action: "like",
    date: { $gte: today },
  }).select("userId targetUserId");

  const matchedUserIds = new Set(
    matchedSwipes.map((swipe) => swipe.userId.toString())
  );

  const result = swipesToday.map((swipe) => ({
    ...swipe.toObject(),
    isMatch: matchedUserIds.has(swipe.targetUserId._id.toString()),
  }));

  res.send(result);
};

const purchasePremium = async (req: Request, res: Response) => {
  const user = await User.findOne({
    _id: req.user._id.toString(),
    valid: true,
  });

  if (!user) {
    res.status(404).send({ message: "Invalid account" });
    return;
  }

  if (user.premium) {
    res.status(400).send({ message: "Your account already a premium member" });
    return;
  }

  user.premium = true;
  await user.save();

  res.send({ message: "Premium membership activated" });
};

const cancelPremium = async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id.toString());

  if (!user.premium) {
    res.status(400).send({ message: "Your account are not a premium member" });
    return;
  }

  user.premium = false;
  await user.save();

  res.send({ message: "Premium membership deactivated" });
};

export {
  getUser,
  userCandidates,
  getCandidate,
  swipeCandidate,
  swipeHistory,
  purchasePremium,
  cancelPremium,
};
