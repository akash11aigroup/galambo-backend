import mongoose, { Schema } from "mongoose";
export interface IHistory extends Document {
  user: string;
  history: Array<Object>;
}
const HistorySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  history: [
    {
      keyword: {
        type: String,
        require: true,
      },
      date: {
        type: Date,
        require: true,
      },
    },
  ],
});

export default HistorySchema;
