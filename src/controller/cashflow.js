import db from "../config/database.js";
import dayjs from "dayjs";

export async function wallet(req, res) {
  const { value, description, type } = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!value || !description)
    return res
      .status(422)
      .send("All fields (value and description) are required");

  const checkSession = await db.collection("sessions").findOne({ token });
  console.log(checkSession)
  
  const cashFlow = {
    value,
    description,
    type,
    date: dayjs().format("DD/MM"),
    idUser: checkSession.idUser,
  };
  // console.log(cashFlow)

  try {
    await db.collection("wallet").insertOne({ ...cashFlow });

    res.send(cashFlow);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Deu algo errado no servidor");
  }
}
