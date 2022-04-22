import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          debugger;
          const token = request?.cookies['auth-cookie'];
          if (!token) {
            return null;
          }
          return token;
        },
      ]),
    });
  }

  async validate(payload: any) {
    console.log(payload);
    if (payload) return payload;

    return false;
  }
}
