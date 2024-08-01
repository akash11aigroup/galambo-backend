import express, { Express } from "express";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";

import authRouter from "../routes/auth/auth";
import manageRouter from "../routes/user/manage";
import searchRouter from "../routes/openai/openai";
import cors from "cors";
import mongoose from "mongoose";
dotenv.config();

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 4000;

app.use("/api", searchRouter);
app.use("/auth", authRouter);
app.use("/manage", manageRouter);

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("MongoDB Connected!"))
  .catch((err: any) => {
    console.error(`MongoDB Connection Error! :=> ${err}`);
    process.exit();
  });

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

module.exports = app;
