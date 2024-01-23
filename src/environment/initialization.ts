import * as Joi from "joi";

// validating required variables in order to avoid null values on runtime
export const schema = Joi.object({
  API_PORT: Joi.number().default(8000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  // WARNING: set these env variables in production
  ACCESS_TOKEN_PASS: Joi.string().default("at-secret"),
  REFRESH_TOKEN_PASS: Joi.string().default("rt-secret"),
  JWT_EXPIRATION_TIME: Joi.number().default(300), // 5 minutes
  JWT_REFRESH_EXPIRATION_TIME: Joi.number().default(604800), // 1 week
  SALT_LENGTH: Joi.number().min(10).max(16).default(10),
  TZ: Joi.string().default("America/Guayaquil"),
});
