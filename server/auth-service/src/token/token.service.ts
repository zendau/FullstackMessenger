import { EntityManager, Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from './token.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private jwtService: JwtService,
  ) { }

  generateTokens(payload) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '5m',
      secret: process.env.JWT_ACCESS_SECRET,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async findTokenAndGet(refreshToken: string) {
    const tokenData = await this.tokenRepository.findOne({ refreshToken });

    if (tokenData === undefined) {
      return {
        status: false,
        message: 'Not auth',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    } else {
      const userData = await this.jwtService.decode(tokenData.refreshToken);

      if (typeof userData === 'object') {
        return {
          status: true,
          userData: userData,
        };
      } else {
        throw new Error('Not valid user refresh token data');
      }
    }
  }

  saveToken(userId: number, refreshToken: string, manager: null);
  saveToken(userId: number, refreshToken: string, manager: EntityManager);

  async saveToken(userId: number, refreshToken: string, manager?: any) {
    if (manager === null) manager = this.tokenRepository;

    const tokenData = await this.tokenRepository.findOne({
      where: {
        userId,
      },
    });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await manager.save(tokenData);
    }

    const tokenEntity = await this.tokenRepository.create();
    tokenEntity.refreshToken = refreshToken;
    tokenEntity.userId = userId;

    const token = await manager.save(tokenEntity);
    return token;
  }

  async removeToken(refreshToken) {
    console.log('token', refreshToken);
    try {
      const tokenData = await this.tokenRepository
        .createQueryBuilder()
        .delete()
        .where('refreshToken = :refreshToken', { refreshToken })
        .execute();
      return !!tokenData.affected;
    } catch (e) {
      console.log('data e', e);
      return {
        status: false,
        message: 'Token not found',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }


  }

  // async refreshToken(refreshToken) {
  //   const tokenData = await this.findToken(refreshToken);
  //   if (tokenData === null) {
  //     return {
  //       status: false,
  //       message: 'Token not found',
  //       httpCode: HttpStatus.BAD_REQUEST,
  //     };
  //   }
  //   //const userData = await this.jwtService.decode(refreshToken);

  //   console.log(tokenData);
  // }
}
