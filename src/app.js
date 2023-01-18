import express, { json } from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from "joi";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

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

const sign_InScheme = joi.object({
  email: joi.string().email().required(),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const sign_UpScheme = joi.object({
  name: joi.string().min(1).required(),
  email: joi.string().email().required(),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required(),
});

const newDepositScheme = joi.object({
  value: joi.number().positive().required(),
  description: joi.string().min(1).required(),
});

const newWithdrawScheme = joi.object({
  value: joi.number().negative().required(),
  description: joi.string().min(1).required(),
});

app.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(422).send("All fields (email and password) are required");

  const { error, value } = sign_InScheme.validate(
    { email, password },
    { abortEarly: false }
  );

  if (error) {
    const err = error.details.map((e) => e.message);
    return res.status(422).send(err);
  }

  try {
    const userRegistered = await db
      .collection("users")
      .findOne({ email: value.email });

    const checkPassword = bcrypt.compareSync(
      value.password,
      userRegistered.password
    );

    if (userRegistered && checkPassword) {
      return res.send("Sucess: Loged-In!");
    } else
      res
        .status(422)
        .send("User not registered or Invalid UserName or Invalid Password");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Deu algo errado no servidor");
  }
});

app.post("/sign-up", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword)
    return res
      .status(422)
      .send(
        "All fields (name, email, password and confirmPassword) are required"
      );

  const { error, value } = sign_UpScheme.validate(
    { name, email, password, confirmPassword },
    { abortEarly: false }
  );

  if (error) {
    const err = error.details.map((e) => e.message);
    return res.status(422).send(err);
  }

  const hashPassword = bcrypt.hashSync(value.password, 10);

  let newUser = {
    name: value.name,
    email: value.email,
    password: hashPassword,
  };

  try {
    const nameInUse = await db
      .collection("users")
      .findOne({ name: newUser.name });

    if (nameInUse) return res.status(422).send("Name already registered");

    const emailInUse = await db
      .collection("users")
      .findOne({ email: newUser.email });

    if (emailInUse) return res.status(422).send("E-mail already registered");

    await db.collection("users").insertOne({ ...newUser });

    res.status(201).send("Sucesss: New User Registered!");
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

  const depositsValidation = newDepositScheme.validate(
    { value, description },
    { abortEarly: false }
  );

  if (depositsValidation.error) {
    const err = depositsValidation.error.details.map((e) => e.message);
    return res.status(422).send(err);
  }

  const newDeposit = {
    value: depositsValidation.value,
    description: depositsValidation.description,
  };

  try {
    await db.collection("nova-entrada").insertOne({ ...newDeposit });

    res.send("Sucess: Deposit Registered!");
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

  const withdrawsValidation = newWithdrawScheme.validate(
    { value, description },
    { abortEarly: false }
  );

  if (withdrawsValidation.error) {
    const err = withdrawsValidation.error.details.map((e) => e.message);
    return res.status(422).send(err);
  }

  const newWithdraw = {
    value: withdrawsValidation.value,
    description: withdrawsValidation.description,
  };

  try {
    await db.collection("nova-entrada").insertOne({ ...newWithdraw });

    res.send("Sucess: Withdraw Registered!");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Deu algo errado no servidor");
  }
});

app.listen(PORT, () => console.log("Servidor Rodou Suave"));
