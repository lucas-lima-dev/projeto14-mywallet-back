import { Router } from "express";
import home from "../controller/home.js";

const homeRouter = Router()

homeRouter.get("/home",home)

export default homeRouter