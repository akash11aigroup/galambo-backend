import { Router } from "express";
import { addHistory, getHistory } from "../../controller/historyController";

const router = Router();

router.post("/addhistory", addHistory);
router.post("/gethistory", getHistory);
export default router;
