import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import db from "../config/database.js"


export async function signIn(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(422).send("All fields (email and password) are required");


  try {
    const userRegistered = await db
      .collection("users")
      .findOne({ email });

    const checkPassword = bcrypt.compareSync(
      password,
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
        return res.status(200).send({token,name:userRegistered.name});
      } else {
        await db
          .collection("sessions")
          .insertOne({ idUser: userRegistered._id, token });
        return res.status(200).send({token,name:userRegistered.name});
      }
    } else {
      return res
        .status(422)
        .send("User not registered or Invalid UserName or Invalid Password");
    }
  } catch (error) {
    
    return res.status(500).send("Deu algo errado no servidor");
  }
}

export async function signUp(req, res) {
  const { name, email, password} = req.body;

  if (!name || !email || !password )
    return res
      .status(422)
      .send(
        "All fields (name, email, password and confirmPassword) are required"
      );


  const hashPassword = bcrypt.hashSync(password, 10);

  let newUser = {
    name,
    email,
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

    return res.status(201).send({ name: newUser.name });
  } catch (error) {
    
    return res.status(500).send("Deu algo errado no servidor");
  }
}
