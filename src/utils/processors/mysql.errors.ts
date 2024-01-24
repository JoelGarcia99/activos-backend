export interface IErrorMessage {
  idenfifier?: 'un' | 'una' | 'unos';
  article?: 'el' | 'la';
  entityName: string;
}

export class DbOutputProcessor {
  static processError(err: any, {
    idenfifier = 'un',
    article = 'el',
    entityName = 'registro'
  }: IErrorMessage): string {

    let sqlMessage = err.sqlMessage;
    let error = "";

    switch (err.code) {
      case "ER_DUP_ENTRY":
        error = this.getKeyNameFromErrorMessage(sqlMessage, {
          idenfifier,
          article,
          entityName
        });
        break;
      // TODO: cover more cases
      default:
        error = sqlMessage;
    }

    return error;
  }


  /**
  *
  * This method will extract the key & value of repeated values, so a message like:
  * `Duplicate entry 'garciajunior796@gmail.com' for key 'Usuarios.email'` is turned into
  * something like: `El campo 'email' con el valor 'garciajunior796@gmail.com' ya existe`
  *
  * @param {stirng} errorMessage
  * This must be a [sqlMessage] format string, otherwise the whole string is returned.
  */
  private static getKeyNameFromErrorMessage(
    errorMessage: string,
    options: IErrorMessage
  ): string {
    const pattern = /Duplicate entry '(.*?)' for key '(.*?)'/;
    const match = errorMessage.match(pattern);

    if (match) {
      const value = match[1];
      let key = match[2].split('.').pop(); // Extract the last part of the key

      // removing the contraint name 
      key = key.replaceAll('_UNIQUE', '');


      return `Ya existe ${options.idenfifier} ${options.entityName} con ` +
        `${options.article} ${key} '${value}'`;
    } else {
      return errorMessage;
    }
  }

}
