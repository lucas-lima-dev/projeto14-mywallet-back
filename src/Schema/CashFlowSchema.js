import joi from "joi";

export const cashFlowSchema = joi.object({
  value: joi.number().positive().required(),
  description: joi.string().min(1).required(),
});


