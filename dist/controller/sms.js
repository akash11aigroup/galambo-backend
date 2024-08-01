"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.fotgotPassword = exports.sendSMSEmail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendSMSEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        mail_1.default.setApiKey((_a = process.env.SENDGRID_API) !== null && _a !== void 0 ? _a : "");
        // return res.json("user");\
        const msg = {
            to: "simonweingand73@gmail.com", // Change to your recipient
            from: "webstar0104@gmail.com", // Change to your verified sender
            subject: "Sending with SendGrid is Fun",
            text: "and easy to do anywhere, even with Node.js",
            html: "<strong>and easy to do anywhere, even with Node.js</strong>",
        };
        mail_1.default
            .send(msg)
            .then((response) => {
            console.log(response[0].statusCode);
            console.log(response[0].headers);
        })
            .catch((error) => {
            console.error(error);
        });
    }
    catch (error) {
        // return res.status(500).json(error);
    }
});
exports.sendSMSEmail = sendSMSEmail;
const fotgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    // try {
    mail_1.default.setApiKey((_b = process.env.SENDGRID_API) !== null && _b !== void 0 ? _b : "");
    const { email } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        return res.status(404).json({ user: "User not found!" });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, (_c = process.env.JWT_SECRET) !== null && _c !== void 0 ? _c : "", {
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
        yield mail_1.default.send(msg);
        res.json({ message: "Reset password email sent" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending email" });
    }
});
exports.fotgotPassword = fotgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { token, password } = req.body;
    let userId;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, (_d = process.env.JWT_SECRET) !== null && _d !== void 0 ? _d : "");
        userId = decoded.userId;
    }
    catch (error) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }
    const user = yield User_1.default.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    user.password = password; // Assuming you use bcrypt to hash passwords
    yield user.save();
    res.json({ message: "Password reset successful", success: true });
});
exports.resetPassword = resetPassword;
