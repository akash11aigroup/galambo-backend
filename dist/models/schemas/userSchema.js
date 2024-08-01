"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
    },
    auth_provider: {
        type: String,
        enum: ["jwt", "google"],
        default: "jwt",
    },
});
exports.default = UserSchema;
