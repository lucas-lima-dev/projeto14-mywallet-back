import express, { json } from "express";
import cors from "cors";
import authRouter from "./routes/AuthRoutes.js";
import homeRouter from "./routes/HomeRouter.js";
import cashFlowRouter from "./routes/CashFlowRoutes.js";

const PORT = 5000;
const app = express();
app.use([
  cors(),
  json(),
  authRouter,
  homeRouter,
  cashFlowRouter
])

app.listen(PORT, () => console.log("Servidor Rodou Suave"));
