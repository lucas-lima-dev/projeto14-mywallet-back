import { Router } from "express";
import { deposit,withdraw } from "../controller/cashflow.js";

const cashFlowRouter = Router()

cashFlowRouter.post("/deposit",deposit)
cashFlowRouter.post("/withdraw",withdraw)

export default cashFlowRouter