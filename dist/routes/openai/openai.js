"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const openai_1 = require("../../controller/openai");
const sms_1 = require("../../controller/sms");
const router = express_1.default.Router();
router.get("/query", openai_1.queryMerge);
router.post("/search", openai_1.searchEngine);
router.post("/sendmail", openai_1.onSendMail);
router.post("/sendsms", sms_1.sendSMSEmail);
router.post("/forgot", sms_1.fotgotPassword);
router.post("/reset-password", sms_1.resetPassword);
exports.default = router;
