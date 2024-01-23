/**
 * Dumps the env values from the environment variables based on a Joi schema. 
 */
export class EnvValue {
  public static API_PORT = process.env.API_PORT ?? 8000;
  public static DB_HOST = process.env.DB_HOST;
  public static DB_PORT = process.env.DB_PORT ?? 3306;
  public static DB_NAME = process.env.DB_NAME;
  public static DB_USER = process.env.DB_USER;
  public static DB_PASS = process.env.DB_PASS;
  public static ACCESS_TOKEN_PASS = process.env.ACCESS_TOKEN_PASS;
  public static REFRESH_TOKEN_PASS = process.env.REFRESH_TOKEN_PASS;
  public static JWT_EXPIRATION_TIME = +process.env.JWT_EXPIRATION_TIM;
  public static JWT_REFRESH_EXPIRATION_TIME = +process.env.JWT_REFRESH_EXPIRATION_TIME;
  public static SALT_LENGTH = +process.env.SALT_LENGTH;
  public static TZ = process.env.TZ;
  public static SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;


  /**
  * WARNING: Do not forget to call this method in a high order function in order to 
  * initialize all the env variables after a Joi validation, otherwise unexpected
  * behaviors could happen
  *
  * @param {any} values
  * This is the output of a Joi schema
  */
  public static init(values: any) {
    EnvValue.API_PORT = values.API_PORT;
    EnvValue.DB_HOST = values.DB_HOST;
    EnvValue.DB_PORT = values.DB_PORT;
    EnvValue.DB_NAME = values.DB_NAME;
    EnvValue.DB_USER = values.DB_USER;
    EnvValue.DB_PASS = values.DB_PASS;
    EnvValue.ACCESS_TOKEN_PASS = values.ACCESS_TOKEN_PASS;
    EnvValue.REFRESH_TOKEN_PASS = values.REFRESH_TOKEN_PASS;
    EnvValue.JWT_EXPIRATION_TIME = +values.JWT_EXPIRATION_TIME;
    EnvValue.JWT_REFRESH_EXPIRATION_TIME = +values.JWT_REFRESH_EXPIRATION_TIME;
    EnvValue.SALT_LENGTH = +values.SALT_LENGTH;
    EnvValue.TZ = values.TZ;
    EnvValue.SENDGRID_API_KEY = values.SENDGRID_API_KEY;

    console.log("Setting timezone for", EnvValue.TZ, "⏱️");
  }
}
