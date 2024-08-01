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
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const auth_1 = require("../libs/auth");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get token from header
    const token = req.header("x-auth-token");
    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }
    // Verify token
    try {
        const decoded = yield (0, auth_1.verifyAuthByHeader)(token);
        if (decoded) {
            req.user = decoded;
            next();
        }
        else {
            return res.status(401).json({ msg: "Your token has been expired" });
        }
    }
    catch (err) {
        console.error("something wrong with auth middleware");
        res.status(500).json({ msg: "Server Error" });
    }
});
exports.auth = auth;
