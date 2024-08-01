import { RequestHandler } from "express";
import History from "../models/History";
import User from "../models/User";
/**
 * @method POST
 * @param req
 * @param res
 * @returns
 */
export const addHistory: RequestHandler = async (req, res) => {
  try {
    const { id, history } = req.body;
    const exist_user = await User.findById(id);
    if (exist_user) {
      const exist_history = await History.findOne({ user: id });
      if (exist_history) {
        exist_history.history.push({ keyword: history, date: Date.now() });
        const historyDB = await exist_history.save();

        return res.json({ data: historyDB });
      } else {
        const new_history = new History({
          user: id,
          history: [{ keyword: history, date: Date.now() }],
        });
        // console.log(new_history);
        const historyDB = await new_history.save();

        return res.json({ data: historyDB });
      }
    } else {
      return res.status(404).json({ user: "User not found!" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
/**
 * @method POST
 * @param req
 * @param res
 * @returns
 */
export const getHistory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.body;
    const exist_user = await User.findById(id);
    if (exist_user) {
      const exist_history = await History.findOne({ user: id });
      if (exist_history) {
        return res.json({ data: exist_history });
      } else {
        return res.json({ data: [] });
      }
    } else {
      return res.status(404).json({ user: "User not found!" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
