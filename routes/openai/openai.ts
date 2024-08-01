import express, { Router } from "express";

import { searchEngine, queryMerge, onSendMail } from "../../controller/openai";
import {
  sendSMSEmail,
  fotgotPassword,
  resetPassword,
} from "../../controller/sms";

const router: Router = express.Router();

router.get("/query", queryMerge);
router.post("/search", searchEngine);
router.post("/sendmail", onSendMail);
router.post("/sendsms", sendSMSEmail);
router.post("/forgot", fotgotPassword);
router.post("/reset-password", resetPassword);

export default router;
