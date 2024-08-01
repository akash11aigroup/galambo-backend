import mongoose from "mongoose";
import HistorySchema from "./schemas/userHistory";
import { IHistory } from "./schemas/userHistory";

const History = mongoose.model<IHistory>("histories", HistorySchema);
export default History;
