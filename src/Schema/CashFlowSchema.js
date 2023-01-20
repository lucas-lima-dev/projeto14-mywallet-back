import joi from "joi";

export const newDepositSchema = joi.object({
  value: joi.number().positive().required(),
  description: joi.string().min(1).required(),
});

export const newWithdrawSchema = joi.object({
  value: joi.number().negative().required(),
  description: joi.string().min(1).required(),
});
