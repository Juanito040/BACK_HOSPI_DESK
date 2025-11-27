import { injectable } from 'tsyringe';
import jwt, { SignOptions } from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '../../application/ports/ITokenService';
import { config } from '../../config/environment';

@injectable()
export class JWTTokenService implements ITokenService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as string | number,
    } as SignOptions);
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn as string | number,
    } as SignOptions);
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      const payload = jwt.verify(token, config.jwt.secret) as TokenPayload;
      return payload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      const payload = jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
      return payload;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
