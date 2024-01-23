import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { UnauthorizedException } from "@nestjs/common";
import { AccessTokenPayload } from "./at.payload";
import { Session } from "src/auth/entities/session.entity";
import { TokensService } from "./service";
import { EnvValue } from "src/environment/variables";

export interface JwtStrategyOutput {
  rtId: number;
  userId: number;
  accessToken: string;
}

/**
 * The strategy to work with JWT, right now it's implementing rotation refresh tokens in 
 * order to provide a boost on security. Every time a new access token is issued the 
 * refresh token is destroyed and created a new, so no one with the previous credentials 
 * is able to access the system anymore.
 */
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly tokensService: TokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // expiration is ignored since the token could get refreshed using
      // refresh token
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: EnvValue.ACCESS_TOKEN_PASS,
    });
  }

  /**
  * This method is responsible for validating the JWT checking if the AT is still valid, 
  * if it's not then try to renew it using the refresh token if it's still valid and 
  * present on the DB. Any other scenario will result in an exception which is captured 
  * and retrieved to the user 
  *
  * @param {Request} req
  * The [Request] object with the `Authorization` header and a bearer token in it.
  * @param {AccessTokenPayload} payload
  * The payload for generating a new access token if needed.
  */
  async validate(req: Request, payload: AccessTokenPayload): Promise<JwtStrategyOutput> {
    const bearerToken = req.headers['Authorization'].split(' ')[1];

    const { userId, rtId } = payload;

    // getting the new access token 
    let accessToken: string | null;


    try {
      const atValidation = await this.tokensService.checkAccessToken(bearerToken);

      // if the AT is expired then try to renew it 
      if (atValidation.isExpired) {

        // getting the current refresh token to validate if it's still valid
        const session = await this.sessionRepository.findOne({
          where: {
            id: rtId,
          },
        });

        if (!session) {
          throw new UnauthorizedException("Su sesión ya no es válida");
        }

        const currentRT = session.refreshToken;

        // validating the token isn't expired or something
        const rtValidation = await this.tokensService.checkRefreshToken(currentRT);

        if (rtValidation.isExpired || !rtValidation.isValid) {
          throw new UnauthorizedException("Su sesión ya no es válida");
        }

        // rotating the refresh token
        const newRefreshToken = await this.tokensService.createRefreshToken(userId);

        // saving the new refresh token to the DB
        const newSession = await this.saveRtToDb(newRefreshToken, userId)

        // creating the new access token
        const newAT = await this.tokensService.createAccessToken(
          newSession,
        );

        // renewing the access token
        accessToken = newAT;
      }
      else if (!atValidation.isValid) {
        throw new UnauthorizedException("El token no es válido");
      }
      // If the token is valid then I need to check if its RT is still valid as well
      else {
        const refreshToken = await this.sessionRepository.findOne({
          where: {
            id: rtId,
          },
        });

        // if the refresh token doesn't exist then throw an exception
        if (!refreshToken) {
          throw new UnauthorizedException("Su sesión ya no es válida");
        }

        // in the case the AT is still valid then just use it
        accessToken = bearerToken;
      }

    } catch (e) {
      console.error(e);
      throw e;
    }

    return {
      rtId,
      userId,
      accessToken,
    };
  }

  /**
  * Saves a new refresh token to the DB and returns an associated session
  */
  private async saveRtToDb(refreshToken: string, userId: number): Promise<Session> {
    // querying all the RT for the user with ID [userId]
    const sessions = await this.sessionRepository.find({
      where: {
        userId,
      },
    });

    // If there is any session with active RT then revoke them
    if (sessions.length) {
      const newSessions = sessions.map((session) => {
        session.updatedAt = new Date();

        return session;
      });

      // there's a trigger which will remove all these records when 
      // the table reaches 5k records
      await this.sessionRepository.save(newSessions);
    }

    const newSession = await this.sessionRepository.save({
      userId: userId,
      refreshToken,
    });

    return newSession;
  }
}
