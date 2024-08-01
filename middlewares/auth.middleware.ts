import { NextFunction, Response } from "express";
import { IUserRequest } from "../models/schemas/userSchema";
import { verifyAuthByHeader } from "../libs/auth";

export const auth = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  // Verify token
  try {
    const decoded = await verifyAuthByHeader(token);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      return res.status(401).json({ msg: "Your token has been expired" });
    }
  } catch (err) {
    console.error("something wrong with auth middleware");
    res.status(500).json({ msg: "Server Error" });
  }
};
