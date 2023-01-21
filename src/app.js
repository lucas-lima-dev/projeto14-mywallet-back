import express, { json } from "express";
import cors from "cors";
import authRouter from "./routes/AuthRoutes.js";
import homeRouter from "./routes/HomeRouter.js";
import cashFlowRouter from "./routes/CashFlowRoutes.js";

const PORT = process.env.PORT || 5008;
const app = express();
app.use([
  cors(),
  json(),
  authRouter,
  homeRouter,
  cashFlowRouter
])

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
