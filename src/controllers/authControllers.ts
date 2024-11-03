import { RequestHandler, Request, Response } from "express";
import User, { IUser } from "../models/User";
import { generateToken, clearToken } from "../utils/auth";

const registerUser = async (
  req: Request<
    {},
    {},
    { name: string; email: string; password: string; confirmPassword: string }
  >,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check for existing user
    const userExists: IUser | null = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "The user already exists" });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    // Check for matching passwords
    if (confirmPassword !== password) {
      res.status(400).json({ message: "Password not match" });
      return;
    }

    // Validate password strength
    const weakPasswordCriteria =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; // At least 8 characters, one uppercase letter, and one special character
    if (!weakPasswordCriteria.test(password)) {
      res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter and one special character",
      });
      return;
    }

    // Create user
    const user: IUser = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      generateToken(res, user._id.toString());
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
      });
      return;
    } else {
      res
        .status(400)
        .json({ message: "An error occurred in creating the user" });
      return;
    }
  } catch (error) {
    res.status(400).json({ message: error.toString() });
    return;
  }
};

const authenticateUser = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    const user: IUser | null = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      generateToken(res, user._id.toString());
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
      });
      return;
    } else {
      res.status(401).json({ message: "Incorrect email or password" });
      return;
    }
  } catch (error) {
    res.status(400).json({ message: error.toString() });
    return;
  }
};

const logoutUser = (req: Request, res: Response) => {
  clearToken(res);
  res.status(200).json({ message: "Logged out" });
};

export { registerUser, authenticateUser, logoutUser };
