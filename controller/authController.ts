import { RequestHandler, Response } from "express";
import User from "../models/User";
import { generateJwtToken } from "../libs/auth";
import { IUser, IUserRequest } from "../models/schemas/userSchema";

/**
 * @method POST
 * @param req
 * @param res
 * @returns
 */
export const signupController: RequestHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({
      name,
      email,
      password,
      auth_provider: "jwt",
    });

    const user = await newUser.save();

    return res.json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const loginController: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ user: "User not found!" });
    }

    // Here we assert that user is of IUser type.
    const isPasswordMatch = await (user as IUser).comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(400).json({ password: "Invalid password" });
    }
    const token = await generateJwtToken(user);

    await User.findByIdAndUpdate(
      user._id,
      { ...user, lastLoginTime: new Date() },
      {
        new: true,
      }
    );

    return res.json({
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const googleAuthController: RequestHandler = async (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ error: "email is requried!" });
  }

  try {
    let user = await User.findOne({
      email,
    });

    if (!user) {
      const newUser = new User({
        name,
        email,
        auth_provider: "google",
      });
      user = await newUser.save();
    }

    const token = await generateJwtToken(user);

    await User.findByIdAndUpdate(
      user._id,
      { ...user },
      {
        new: true,
      }
    );

    return res.json({
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const userVerify = async (req: IUserRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "The user is not exists" });

    const newToken = await generateJwtToken(user);

    await user.updateOne({ lastLoginTime: new Date() });
    return res.json({
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
      token: newToken,
    });
  } catch (err) {
    console.error("--- user verification error ---", err);
    return res.status(500).json({
      success: false,
      message: "The token is unavailable",
    });
  }
};
