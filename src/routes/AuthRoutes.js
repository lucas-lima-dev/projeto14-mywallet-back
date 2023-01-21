import { Router } from "express";
import {signIn,signUp} from "../controller/auth.js"
import {validateSchemaMiddleware} from "../middleware/validateSchemaMiddleware.js"
import {sign_InSchema,sign_UpSchema} from "../Schema/AuthSchema.js"

const authRouter = Router()



authRouter.post("/",validateSchemaMiddleware(sign_InSchema),signIn)
authRouter.post("/sign-up",validateSchemaMiddleware(sign_UpSchema),signUp)

export default authRouter