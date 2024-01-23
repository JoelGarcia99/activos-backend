import { Injectable } from "@nestjs/common";
import { JwtStrategyOutput } from "src/jwt/strategy";

export interface ResponseUtilOutput {
  data: any;
  accessToken: string;
}

@Injectable()
export class ResponseBuilder {

  /**
  * Builds a response injecting the access token with up to date 
  * privileges
  *
  * @param response - It's the JSON response. It'll be injected as 'data'
  */
  static async build(
    request: Request,
    response: (userId: number) => Promise<any>
  ): Promise<ResponseUtilOutput> {

    const { accessToken, userId } = request['user'] as JwtStrategyOutput;

    return {
      data: await response(userId),
      accessToken,
    };
  }
}
