import { RequestHandler } from "express";
import sgMail from "@sendgrid/mail";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const sendSMSEmail: RequestHandler = async (req, res) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API ?? "");
    // return res.json("user");\
    const msg = {
      to: "simonweingand73@gmail.com", // Change to your recipient
      from: "webstar0104@gmail.com", // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };

    sgMail
      .send(msg)
      .then((response: any) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
      })
      .catch((error: any) => {
        console.error(error);
      });
  } catch (error) {
    // return res.status(500).json(error);
  }
};

export const fotgotPassword: RequestHandler = async (req, res) => {
  // try {
  sgMail.setApiKey(process.env.SENDGRID_API ?? "");
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ user: "User not found!" });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET ?? "", {
    expiresIn: "1h",
  });
  const url = `https://galambo.com/reset-password/${token}`;

  const msg = {
    to: user.email,
    from: "no-reply@galambo.com", // Use the email address or domain you verified with SendGrid
    subject: "Reset Password",
    html: `Click <a href="${url}">here</a> to reset your password`,
  };

  try {
    await sgMail.send(msg);
    res.json({ message: "Reset password email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email" });
  }
};

export const resetPassword: RequestHandler = async (req, res) => {
  const { token, password } = req.body;
  let userId;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET ?? "");
    userId = decoded.userId;
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.password = password; // Assuming you use bcrypt to hash passwords
  await user.save();

  res.json({ message: "Password reset successful", success: true });
};
