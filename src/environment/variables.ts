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


  /**
  * WARNING: Do not forget to call this method in a high order function in order to 
  * initialize all the env variables after a Joi validation, otherwise unexpected
  * behaviors could happen
  */
  public static init() {
    EnvValue.API_PORT = process.env.API_PORT;
    EnvValue.DB_HOST = process.env.DB_HOST;
    EnvValue.DB_PORT = process.env.DB_PORT;
    EnvValue.DB_NAME = process.env.DB_NAME;
    EnvValue.DB_USER = process.env.DB_USER;
    EnvValue.DB_PASS = process.env.DB_PASS;
    EnvValue.ACCESS_TOKEN_PASS = process.env.ACCESS_TOKEN_PASS;
    EnvValue.REFRESH_TOKEN_PASS = process.env.REFRESH_TOKEN_PASS;
    EnvValue.JWT_EXPIRATION_TIME = +process.env.JWT_EXPIRATION_TIME;
    EnvValue.JWT_REFRESH_EXPIRATION_TIME = +process.env.JWT_REFRESH_EXPIRATION_TIME;
    EnvValue.SALT_LENGTH = +process.env.SALT_LENGTH;
  }
}
