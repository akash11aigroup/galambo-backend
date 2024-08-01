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
exports.verifyEmailToken = exports.generateEmailVerificationJwtToken = exports.verifyAuthByHeader = exports.generateJwtToken = exports.verifyAuth = exports.AuthError = void 0;
const jose_1 = require("jose");
const uuid_1 = require("uuid");
class AuthError extends Error {
}
exports.AuthError = AuthError;
// ------------------ Generate new jwt token and return with NextResponse and verify by cookie ------------------
function verifyAuth(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.cookies.get("user-token")) === null || _a === void 0 ? void 0 : _a.value;
        if (!token)
            throw new AuthError("Missing user token");
        try {
            const verified = yield (0, jose_1.jwtVerify)(token, new TextEncoder().encode(process.env.JWT_SECRET_KEY));
            return verified.payload;
        }
        catch (err) {
            throw new AuthError("Your token has expired.");
        }
    });
}
exports.verifyAuth = verifyAuth;
// ------------------------------------------------------------------------------------------------------------
// ------------------ generate new JWT Token and verify token by request header -----------------------
const generateJwtToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = yield new jose_1.SignJWT({
        auth: user.email,
        id: user._id,
    })
        .setProtectedHeader({ alg: "HS256" })
        // .setJti(nanoid())
        .setJti((0, uuid_1.v4)())
        .setIssuedAt()
        .setExpirationTime((_a = process.env.JWT_EXPIRES_IN) !== null && _a !== void 0 ? _a : 0)
        .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY));
    return token;
});
exports.generateJwtToken = generateJwtToken;
const verifyAuthByHeader = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token)
        throw new AuthError("Missing user token");
    try {
        const verified = yield (0, jose_1.jwtVerify)(token, new TextEncoder().encode(process.env.JWT_SECRET_KEY));
        return verified.payload;
    }
    catch (err) {
        throw new AuthError("Your token has expired.");
    }
});
exports.verifyAuthByHeader = verifyAuthByHeader;
const generateEmailVerificationJwtToken = (user, method) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const token = yield new jose_1.SignJWT({
            auth: user.email,
            id: user._id,
            method: method,
        })
            .setProtectedHeader({ alg: "HS256" })
            // .setJti(nanoid())
            .setJti((0, uuid_1.v4)())
            .setIssuedAt()
            .setExpirationTime((_b = process.env.JWT_EMAIL_EXPIRES_IN) !== null && _b !== void 0 ? _b : 0)
            .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY));
        return token;
    }
    catch (err) {
        throw new Error("Failed to generate new Token");
    }
});
exports.generateEmailVerificationJwtToken = generateEmailVerificationJwtToken;
const verifyEmailToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token)
        throw new AuthError("Missing email token");
    try {
        const verified = yield (0, jose_1.jwtVerify)(token, new TextEncoder().encode(process.env.JWT_SECRET_KEY));
        return verified.payload;
    }
    catch (err) {
        throw new AuthError("Your token has expired.");
    }
});
exports.verifyEmailToken = verifyEmailToken;
// -----------------------------------------------------------------------------------------------------
