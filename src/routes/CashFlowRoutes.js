import { Router } from "express";
import { wallet } from "../controller/cashflow.js";
import { authValidation } from "../middleware/AuthMiddleware.js";
import { cashFlowSchemaMiddleware } from "../middleware/CashFlowMiddleware.js";
import { cashFlowSchema } from "../Schema/CashFlowSchema.js";

const cashFlowRouter = Router()

cashFlowRouter.post("/wallet",authValidation,cashFlowSchemaMiddleware(cashFlowSchema),wallet)


export default cashFlowRouter