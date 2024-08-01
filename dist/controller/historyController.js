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
exports.getHistory = exports.addHistory = void 0;
const History_1 = __importDefault(require("../models/History"));
const User_1 = __importDefault(require("../models/User"));
/**
 * @method POST
 * @param req
 * @param res
 * @returns
 */
const addHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, history } = req.body;
        const exist_user = yield User_1.default.findById(id);
        if (exist_user) {
            const exist_history = yield History_1.default.findOne({ user: id });
            if (exist_history) {
                exist_history.history.push({ keyword: history, date: Date.now() });
                const historyDB = yield exist_history.save();
                return res.json({ data: historyDB });
            }
            else {
                const new_history = new History_1.default({
                    user: id,
                    history: [{ keyword: history, date: Date.now() }],
                });
                // console.log(new_history);
                const historyDB = yield new_history.save();
                return res.json({ data: historyDB });
            }
        }
        else {
            return res.status(404).json({ user: "User not found!" });
        }
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.addHistory = addHistory;
/**
 * @method POST
 * @param req
 * @param res
 * @returns
 */
const getHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const exist_user = yield User_1.default.findById(id);
        if (exist_user) {
            const exist_history = yield History_1.default.findOne({ user: id });
            if (exist_history) {
                return res.json({ data: exist_history });
            }
            else {
                return res.json({ data: [] });
            }
        }
        else {
            return res.status(404).json({ user: "User not found!" });
        }
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.getHistory = getHistory;
