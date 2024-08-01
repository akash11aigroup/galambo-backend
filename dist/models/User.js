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
exports.hashPassword = void 0;
/** User Model based on user schema for mongoose */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema_1 = __importDefault(require("./schemas/userSchema"));
const signPayload_1 = __importDefault(require("../configs/signPayload"));
// const expires = eval(JWT_EXPIRES_IN) ?? 1000 * 60 * 15;
userSchema_1.default.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.isModified("password"))
            return next();
        if (user.password) {
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hash = yield bcryptjs_1.default.hash(user.password, salt);
            user.password = hash;
            next();
        }
    });
});
userSchema_1.default.methods.generateToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, signPayload_1.default)({
            payload: {
                id: this._id,
                username: this.username,
                email: this.email,
            },
            secret: process.env.JWT_SECRET || "",
            expirationTime: process.env.JWT_EXPIRES_IN || "",
        });
    });
};
userSchema_1.default.methods.comparePassword = function (enteredPassword) {
    var _a;
    const user = this;
    return bcryptjs_1.default.compareSync(enteredPassword, (_a = user.password) !== null && _a !== void 0 ? _a : "");
};
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield new Promise((resolve, reject) => {
        bcryptjs_1.default.hash(password, 10, function (err, hash) {
            if (err) {
                reject(err);
            }
            else {
                resolve(hash);
            }
        });
    });
    return hashedPassword;
});
exports.hashPassword = hashPassword;
const User = mongoose_1.default.model("users", userSchema_1.default);
exports.default = User;
