import db from "../config/database.js"
import { newDepositSchema,newWithdrawSchema } from "../Schema/CashFlowSchema.js";

export async function deposit(req,res){
    const { value, description } = req.body;
  
    if (!value || !description)
      return res
        .status(422)
        .send("All fields (value and description) are required");
  
    const depositsValidation = newDepositSchema.validate(
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
      await db.collection("deposit").insertOne({ ...newDeposit });
  
      res.send("Sucess: Deposit Registered!");
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Deu algo errado no servidor");
    }
}

export async function withdraw(req,res){
    const { value, description } = req.body;
  
    if (!value || !description)
      return res
        .status(422)
        .send("All fields (value and description) are required");
  
    const withdrawsValidation = newWithdrawSchema.validate(
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
      await db.collection("withdraw").insertOne({ ...newWithdraw });
  
      return res.send("Sucess: Withdraw Registered!");
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Deu algo errado no servidor");
    }
}


  
 