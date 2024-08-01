"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userHistory_1 = __importDefault(require("./schemas/userHistory"));
const History = mongoose_1.default.model("histories", userHistory_1.default);
exports.default = History;
