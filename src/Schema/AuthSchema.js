import joi from "joi";

export const sign_InSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

export const sign_UpSchema = joi.object({
  name: joi.string().min(1).required(),
  email: joi.string().email().required(),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required(),
});
