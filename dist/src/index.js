"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("../routes/auth/auth"));
const manage_1 = __importDefault(require("../routes/user/manage"));
const openai_1 = __importDefault(require("../routes/openai/openai"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
const port = process.env.PORT || 4000;
app.use("/api", openai_1.default);
app.use("/auth", auth_1.default);
app.use("/manage", manage_1.default);
mongoose_1.default
    .connect(process.env.MONGO_URI || "")
    .then(() => console.log("MongoDB Connected!"))
    .catch((err) => {
    console.error(`MongoDB Connection Error! :=> ${err}`);
    process.exit();
});
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.join(__dirname, "../client/build")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "../client/build/index.html"));
    });
}
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
