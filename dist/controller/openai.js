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
exports.onSendMail = exports.getSearchQuery = exports.searchEngine = exports.queryMerge = void 0;
const axios_1 = __importDefault(require("axios"));
const openai_1 = __importDefault(require("openai"));
const sgMail = require("@sendgrid/mail");
const queryMerge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, word } = req.query;
    const merged_query = query + ", " + word;
    const openai = new openai_1.default({
        apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
    });
    const chatCompletion = yield openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant who provides search keywords. Please reply with only one simple combined search keywords based on users question.",
            },
            { role: "user", content: merged_query },
        ],
        model: "gpt-3.5-turbo",
    });
    const search_query = chatCompletion.choices[0].message.content;
    if (chatCompletion) {
        const res_data = yield (0, exports.getSearchQuery)(search_query);
        res.status(200).json(res_data);
    }
});
exports.queryMerge = queryMerge;
const searchEngine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchData = req.body.data;
    const data = yield (0, exports.getSearchQuery)(searchData);
    res.json(data);
});
exports.searchEngine = searchEngine;
const getSearchQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield axios_1.default.get(`https://explorer-search.fly.dev/submitSearch?query=%5B%22${query}%22%5D&userid_auth=undefined&userid_local=user_1709980487977_7vvu2op5u&model=gpt-3.5`);
    return data.data;
});
exports.getSearchQuery = getSearchQuery;
const onSendMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, topic, comments } = req.body;
        const output = `<span>Name: ${name}</span><br/>
  <span>Email: ${email}</span><br/>
  <span>Topic: ${topic}</span><br/>
  <span>Comments: ${comments}</span>`;
        sgMail.setApiKey(process.env.SENDGRID_API);
        const msg = {
            to: { email }, // Change to your recipient
            from: "info@galambo.com", // Change to your verified sender
            subject: "Contact US",
            text: "",
            html: output,
        };
        sgMail
            .send(msg)
            .then((response) => {
            if (response) {
                return res.json({ msg: "success" });
            }
        })
            .catch((error) => {
            console.error(error);
        });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.onSendMail = onSendMail;
