import { Router } from "express";
import { deposit,withdraw } from "../controller/cashflow.js";
import { authValidation } from "../middleware/AuthMiddleware.js";

const cashFlowRouter = Router()

cashFlowRouter.post("/deposit",authValidation,deposit)
cashFlowRouter.post("/withdraw",authValidation,withdraw)

export default cashFlowRouter