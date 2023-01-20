import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import db from "../config/database.js"
import { sign_InSchema,sign_UpSchema } from "../Schema/AuthSchema.js";

export async function signIn(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(422).send("All fields (email and password) are required");

  const { error, value } = sign_InSchema.validate(
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
      const token = uuidV4();
      const tokenExists = await db
        .collection("sessions")
        .findOne({ idUser: userRegistered._id });

      if (tokenExists) {
        await db
          .collection("sessions")
          .updateOne({ idUser: userRegistered._id }, { $set: { token } });
        return res.status(200).send(token);
      } else {
        await db
          .collection("sessions")
          .insertOne({ idUser: userRegistered._id, token });
        return res.status(200).send(token);
      }
    } else {
      return res
        .status(422)
        .send("User not registered or Invalid UserName or Invalid Password");
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Deu algo errado no servidor");
  }
}

export async function signUp(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword)
    return res
      .status(422)
      .send(
        "All fields (name, email, password and confirmPassword) are required"
      );

  const { error, value } = sign_UpSchema.validate(
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

    return res.status(201).send("Sucesss: New User Registered!");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Deu algo errado no servidor");
  }
}
