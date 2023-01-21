import { Router } from "express";
import home from "../controller/home.js";
import { authValidation } from "../middleware/AuthMiddleware.js";

const homeRouter = Router()

homeRouter.get("/home",authValidation,home)

export default homeRouter