import db from "../config/database.js";

export default async function home(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const checkSession = await db.collection("sessions").findOne({ token });

    if (!checkSession) return res.status().send();

    const withdraws = await db.collection("withdraws").find().toArray();

    const deposits = await db.collection("deposits").find().toArray();

    return res.send(withdraws, deposits);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Deu algo errado no servidor");
  }
}
