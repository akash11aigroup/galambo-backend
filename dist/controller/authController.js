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
exports.userVerify = exports.googleAuthController = exports.loginController = exports.signupController = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../libs/auth");
/**
 * @method POST
 * @param req
 * @param res
 * @returns
 */
const signupController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const newUser = new User_1.default({
            name,
            email,
            password,
            auth_provider: "jwt",
        });
        const user = yield newUser.save();
        return res.json(user);
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.signupController = signupController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ user: "User not found!" });
        }
        // Here we assert that user is of IUser type.
        const isPasswordMatch = yield user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({ password: "Invalid password" });
        }
        const token = yield (0, auth_1.generateJwtToken)(user);
        yield User_1.default.findByIdAndUpdate(user._id, Object.assign(Object.assign({}, user), { lastLoginTime: new Date() }), {
            new: true,
        });
        return res.json({
            user: {
                name: user.name,
                email: user.email,
                id: user._id,
            },
            token,
        });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.loginController = loginController;
const googleAuthController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name } = req.body;
    if (!email) {
        return res.status(400).json({ error: "email is requried!" });
    }
    try {
        let user = yield User_1.default.findOne({
            email,
        });
        if (!user) {
            const newUser = new User_1.default({
                name,
                email,
                auth_provider: "google",
            });
            user = yield newUser.save();
        }
        const token = yield (0, auth_1.generateJwtToken)(user);
        yield User_1.default.findByIdAndUpdate(user._id, Object.assign({}, user), {
            new: true,
        });
        return res.json({
            user: {
                name: user.name,
                email: user.email,
                id: user._id,
            },
            token,
        });
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.googleAuthController = googleAuthController;
const userVerify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user.id);
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "The user is not exists" });
        const newToken = yield (0, auth_1.generateJwtToken)(user);
        yield user.updateOne({ lastLoginTime: new Date() });
        return res.json({
            user: {
                name: user.name,
                email: user.email,
                id: user._id,
            },
            token: newToken,
        });
    }
    catch (err) {
        console.error("--- user verification error ---", err);
        return res.status(500).json({
            success: false,
            message: "The token is unavailable",
        });
    }
});
exports.userVerify = userVerify;
