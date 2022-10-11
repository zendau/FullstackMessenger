import { EntityManager, Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from './token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IDevice } from './interfaces/ITokenDevice';
import { DeviceService } from './device.service';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private deviceSerivce: DeviceService,
    private jwtService: JwtService,
  ) {}

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

  insertTokens(tokenData, device: number, manager: EntityManager);
  insertTokens(tokenData, device: IDevice, manager: null);

  async insertTokens(
    tokenData,
    device: number | IDevice,
    manager: EntityManager | null,
  ) {
    const tokens = await this.generateTokens(tokenData);

    if (typeof device !== 'number') {
      device = await this.deviceSerivce.add(device);
    }

    await this.saveToken(tokenData.id, tokens.refreshToken, device, manager);
    return tokens;
  }

  async findTokenAndGet(refreshToken: string, deviceTag: string) {

    debugger;
    const tokenData = await this.tokenRepository
      .createQueryBuilder('token')
      .innerJoinAndSelect('token.deviceId', 'device')
      .where('token.refreshToken = :refreshToken', { refreshToken })
      .select(['token.refreshToken, token.deviceId, device.tag'])
      .execute()


    if (tokenData[0] === undefined || tokenData[0].tag !== deviceTag) {
      return {
        status: false,
        message: 'Not auth',
        httpCode: HttpStatus.UNAUTHORIZED,
      };
    } else {
      const userData = await this.jwtService.decode(tokenData[0].refreshToken);

      if (typeof userData === 'object') {

        delete userData['iat']
        delete userData['exp']

        return {
          status: true,
          userData: userData,
          deviceId: tokenData[0].deviceId,
        };
      } else {
        throw new Error('Not valid user refresh token data');
      }
    }
  }

  saveToken(
    userId: number,
    refreshToken: string,
    deviceId: number,
    manager: null,
  );
  saveToken(
    userId: number,
    refreshToken: string,
    deviceId: number,
    manager: EntityManager,
  );

  async saveToken(
    userId: number,
    refreshToken: string,
    deviceId: number,
    manager?: any,
  ) {
    if (manager === null) manager = this.tokenRepository;

    const tokenData = await this.tokenRepository.findOne({
      where: {
        userId,
        deviceId,
      },
    });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await manager.save(tokenData);
    }

    const tokenEntity = await this.tokenRepository.create();
    tokenEntity.refreshToken = refreshToken;
    tokenEntity.userId = userId;
    tokenEntity.deviceId = deviceId;

    const token = await manager.save(tokenEntity);
    return token;
  }

  // async updateToken(tokenData: any, deviceData: IDevice) {

  //   const resUpdate = await this.tokenRepository
  //     .createQueryBuilder()
  //     .update()
  //     .set({
  //       refreshToken: tokens.refreshToken,
  //     })
  //     .where('userId = :userId, deviceId = :deviceId', {
  //       userId: tokenData.id,
  //       deviceId,
  //     })
  //     .execute();

  //   if (!!resUpdate.affected) {
  //     return tokens;
  //   } else {
  //     return {
  //       status: false,
  //       message: 'User not auth',
  //       httpCode: HttpStatus.UNAUTHORIZED,
  //     };
  //   }
  // }

  async removeToken(refreshToken) {
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
}
