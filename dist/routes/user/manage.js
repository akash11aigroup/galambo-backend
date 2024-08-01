"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const historyController_1 = require("../../controller/historyController");
const router = (0, express_1.Router)();
router.post("/addhistory", historyController_1.addHistory);
router.post("/gethistory", historyController_1.getHistory);
exports.default = router;
