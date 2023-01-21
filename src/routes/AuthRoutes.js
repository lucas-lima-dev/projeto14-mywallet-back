import { Router } from "express";
import {signIn,signUp} from "../controller/auth.js"
import {validateSchema} from "../middleware/validateSchema.js"
import {sign_InSchema,sign_UpSchema} from "../Schema/AuthSchema.js"

const authRouter = Router()



authRouter.post("/",validateSchema(sign_InSchema),signIn)
authRouter.post("/sign-up",validateSchema(sign_UpSchema),signUp)

export default authRouter