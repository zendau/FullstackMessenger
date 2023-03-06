import { EntityManager, Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from './token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IDevice } from './interfaces/ITokenDevice';
import { DeviceService } from './device.service';
import IToken from './interfaces/IToken';
import ITokens from './interfaces/ITokens';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private deviceSerivce: DeviceService,
    private jwtService: JwtService,
  ) {}

  generateTokens(payload: IToken) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRE,
      secret: process.env.JWT_ACCESS_SECRET,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  insertTokens(
    tokenData: IToken,
    device: IDevice,
    manager: EntityManager,
  ): Promise<ITokens>;
  insertTokens(
    tokenData: IToken,
    device: IDevice,
    manager: null,
  ): Promise<ITokens>;

  async insertTokens(
    tokenData: IToken,
    device: IDevice,
    manager: EntityManager | null,
  ): Promise<ITokens> {
    let deviceId: number = null;

    const deviceData = await this.deviceSerivce.findByTag(
      device.system.userAgent ?? device.system.mobileData,
      tokenData.id,
    );

    if (!deviceData) {
      deviceId = await this.deviceSerivce.add(device);
    } else {
      deviceId = deviceData.id;
    }

    const tokens = await this.generateTokens({ ...tokenData, deviceId });
    await this.saveToken(tokenData.id, tokens.refreshToken, deviceId, manager);
    return tokens;
  }

  async findTokenAndGet(refreshToken: string, deviceTag: string) {
    const tokenData = await this.tokenRepository
      .createQueryBuilder('token')
      .innerJoinAndSelect('token.deviceId', 'device')
      .where('token.refreshToken = :refreshToken', { refreshToken })
      .select(['token.refreshToken, token.deviceId, device.tag'])
      .execute();

    if (tokenData[0] === undefined || tokenData[0].tag !== deviceTag) {
      return {
        status: false,
        message: 'Not auth',
        httpCode: HttpStatus.UNAUTHORIZED,
      };
    } else {
      const userData = await this.jwtService.decode(tokenData[0].refreshToken);

      if (typeof userData === 'object') {
        delete userData['iat'];
        delete userData['exp'];

        return {
          status: true,
          userData: userData as IToken,
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

  async removeToken(refreshToken: string) {
    try {
      const tokenData = await this.tokenRepository
        .createQueryBuilder()
        .delete()
        .where('refreshToken = :refreshToken', { refreshToken })
        .execute();
      return !!tokenData.affected;
    } catch (e) {
      return {
        status: false,
        message: 'Token not found',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
