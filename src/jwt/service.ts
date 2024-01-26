import { Injectable } from "@nestjs/common";
import { RefreshTokenPayload } from "./rt.payload";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenPayload } from "./at.payload";
import { Session } from "src/auth/entities/session.entity";
import { EnvValue } from "src/environment/variables";

interface TokenCheckOutput {
  isValid: boolean;
  isExpired: boolean;
}

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
  ) { }

  /**
   * It'll create & store a determined refresh token into user session
   * and will write it into DB
   *
   * @return {string} session ID
   */
  async createRefreshToken(userId: number): Promise<string> {

    const payload: RefreshTokenPayload = {
      userId: userId,
    }

    // generating & signing our refresh token
    const refreshToken = this.jwtService.sign(
      payload,
      {
        expiresIn: EnvValue.JWT_REFRESH_EXPIRATION_TIME,
        secret: EnvValue.REFRESH_TOKEN_PASS,
      },
    );

    return refreshToken;
  }

  /**
   * Creates and sign an access token using passport library based on the
   * [AccessTokenPayload] and the provided [session] data. This access token is linked to
   * an existing refresh token on the DB, if the refresh token is invalidated on the DB 
   * then this access token is considered revoked
   *
   * @param {Session} session
   * The session data with the rotative refresh token and the linked user ID.
   *
   * @return {string} signed access token
   */
  async createAccessToken(session: Session): Promise<string> {

    const payload: AccessTokenPayload = {
      rtId: session.id,
      userId: session.userId,
    }

    const accessToken = this.jwtService.sign(
      payload,
      {
        expiresIn: EnvValue.JWT_EXPIRATION_TIME,
        secret: EnvValue.ACCESS_TOKEN_PASS,
      },
    );

    return accessToken;
  }

  /**
   * Checks if a refresh token is still valid
   *
   * @param {string} refreshToken
   * @return {boolean} true if the refresh token is still valid
   */
  async checkRefreshToken(refreshToken: string): Promise<TokenCheckOutput> {

    const decodedToken: RefreshTokenPayload | null = this.jwtService.verify(refreshToken, {
      secret: EnvValue.REFRESH_TOKEN_PASS,
      ignoreExpiration: true,
    });

    // if it's impossible to decode the token then we know it's no longer
    // a valid token
    if (!decodedToken) {
      return {
        isValid: false,
        isExpired: false
      };
    }

    // letting the user know that the token is still valid
    if (decodedToken.exp < Date.now() / 1000) {
      return {
        isValid: false,
        isExpired: true
      };
    }

    return {
      isValid: true,
      isExpired: false
    }
  }

  /**
  * Whereas the access token is valid depends on the response, if it's a string 
  * then it's the access token, othersise it means the access token is not valid 
  * and it cannot be updated
  *
  * @param {string} accessToken
  *
  * @return {string | null} Returns the access token or null if it's invalid or 
  * cannot be renueved
  */
  async checkAccessToken(accessToken: string): Promise<TokenCheckOutput> {
    let decodedToken: AccessTokenPayload | null;

    try {
      decodedToken = this.jwtService.verify(accessToken, {
        secret: EnvValue.ACCESS_TOKEN_PASS,
        ignoreExpiration: true,
      });
    } catch (e) {
      return {
        isValid: false,
        isExpired: true,
      }
    }

    // if it's impossible to decode the token then we know it's no longer
    // a valid token
    if (!decodedToken) {
      return {
        isValid: false,
        isExpired: false
      };
    }

    // letting the user know that the token is still valid
    if (decodedToken.exp < Date.now() / 1000) {
      return {
        isValid: false,
        isExpired: true
      };
    }

    return {
      isValid: true,
      isExpired: false
    }
  }

  /**
  * It'll decode the access token returning its payload for different purposes
  *
  * @param {string} accessToken
  */
  decodeAccessToken(accessToken: string, ignoreExpiration = false): AccessTokenPayload {
    return this.jwtService.verify(accessToken, {
      secret: EnvValue.ACCESS_TOKEN_PASS,
      ignoreExpiration: ignoreExpiration,
    });
  }

}
