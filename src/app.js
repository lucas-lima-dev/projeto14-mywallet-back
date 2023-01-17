import express, { json } from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from "joi";
import dotenv from "dotenv";

dotenv.config();

const PORT = 5000;
const app = express();
app.use(cors());
app.use(json());

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try {
  await mongoClient.connect();
  db = mongoClient.db();
  console.log("Servidor Conectado");
} catch (error) {
  console.log(error.message);
}

sign_InScheme = joi.object({
  email: joi.email().required(),
  password: joi.password().required(),
});

sign_UpScheme = joi.object({
  name: joi.string().min(1).required(),
  email: joi.email().required(),
  password: joi.password().required(),
});

newDepositScheme = joi.object({
  value: joi.number().positive().required(),
  description: joi.string().min(1).required(),
});

newWithdrawScheme = joi.object({
  value: joi.number().negative().required(),
  description: joi.string().min(1).required(),
});

app.get("/", async (req, res) => {
  const { email, password } = req.headers;

  if (!email || password)
    return res.status(422).send("All fields (email and password) are required");

  const { error, value } = sign_InScheme.validade(
    { email, password },
    { abortEarly: false }
  );

  if (error) {
    const err = error.details.map((e) => e.message);
    return res.status(422).send(err);
  }

  try {
    const userRegistered = await db
      .collection("cadastro")
      .find({ email: value.email, password: value.password });

    if (!userRegistered) {
      return res
        .status(422)
        .send("User not registered or Invalid UserName or Invalid Password");
    } else return res.send("Sucess: Loged-In!");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Deu algo errado no servidor");
  }
});

app.post("/cadastro", async (req, res) => {
  const { name, email, password } = req.headers;

  if (!name || !email || !password)
    return res
      .status(422)
      .send("All fields (name, email and password) are required");

  const { error, value } = sign_UpScheme.validade(
    { name, email, password },
    { abortEarly: false }
  );

  if (error) {
    const err = error.details.map((e) => e.message);
    return res.status(422).send(err);
  }

  let newUser = {
    name: value.name,
    email: value.email,
    password: value.password,
  };

  try {
    const nameInUse = await db
      .collection("cadastro")
      .findOne({ name: value.name });

    if (!nameInUse) return res.status(422).send("Name already registered");

    const emailInUse = await db
      .collection("cadastro")
      .findOne({ email: value.email });

    if (!emailInUse) return res.status(422).send("E-mail already registered");

    await db.collection("cadastro").insertOne({ ...newUser });

    res.send("Sucesss: New User Registered!");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Deu algo errado no servidor");
  }
});

app.get("/home", async (req, res) => {
  try {
    const withdraws = await db.collection("saida").find().toArray();

    const deposits = await db.collection("entrada").find().toArray();

    res.send(withdraws, deposits);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Deu algo errado no servidor");
  }
});

app.post("/nova-entrada", async (req, res) => {
  const { value, description } = req.body;

  if (!value || !description)
    return res
      .status(422)
      .send("All fields (value and description) are required");

  const depositsValidation = newDepositScheme.validade(
    { value, description },
    { abortEarly: false }
  );

  if (depositsValidation.error) {
    const err = depositsValidation.error.details.map((e) => e.message);
    return res.status(422).send(err);
  }

  const newDeposit = {
    value:depositsValidation.value,
    description:depositsValidation.description
  }

  try {
    await db.collection("nova-entrada").insertOne({ ...newDeposit });

    res.send("Sucess: Deposit Registered!")

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Deu algo errado no servidor");
  }
});

app.post("/nova-saida", async (req, res) => {
    const { value, description } = req.body;
  
    if (!value || !description)
      return res
        .status(422)
        .send("All fields (value and description) are required");
  
    const withdrawsValidation = newWithdrawScheme.validade(
      { value, description },
      { abortEarly: false }
    );
  
    if (withdrawsValidation.error) {
      const err = withdrawsValidation.error.details.map((e) => e.message);
      return res.status(422).send(err);
    }
  
    const newWithdraw = {
      value:withdrawsValidation.value,
      description:withdrawsValidation.description
    }
  
    try {
      await db.collection("nova-entrada").insertOne({ ...newWithdraw });
  
      res.send("Sucess: Withdraw Registered!")
  
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Deu algo errado no servidor");
    }
  });

app.listen(PORT, () => console.log("Servidor Rodou Suave"));
