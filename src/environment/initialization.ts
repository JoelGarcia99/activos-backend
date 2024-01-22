import * as Joi from "joi";

// validating required variables in order to avoid null values on runtime
export const schema = Joi.object({
  API_PORT: Joi.number().default(8000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
});
