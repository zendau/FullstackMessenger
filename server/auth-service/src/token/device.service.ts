import { Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './device.entity';
import { IDevice, ITokenDevice } from './interfaces/ITokenDevice';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
  ) {}

  parseUserAgent(userAgent: string) {
    const ua = UAParser(userAgent);

    const data: ITokenDevice = {
      brand: ua.browser.name,
      model: ua.browser.version,
      osName: ua.os.name,
      osVersion: ua.os.version,
      tag: userAgent,
    };
    return data;
  }

  parseMobileCode(mobileCode: string) {
    const mobileData = JSON.parse(mobileCode);

    const data: ITokenDevice = {
      brand: mobileData.brand,
      model: mobileData.modelName,
      osName: mobileData.osName,
      osVersion: mobileData.osVersion,
      tag: mobileData.osBuildId,
    };
    return data;
  }

  async add(deviceData: IDevice): Promise<number> {
    let deviceParseData = null;

    if (deviceData.system.userAgent) {
      deviceParseData = this.parseUserAgent(deviceData.system.userAgent);
    } else if (deviceData.system.mobileData) {
      deviceParseData = this.parseMobileCode(deviceData.system.mobileData);
    }
    const resInsered = await this.deviceRepository.save({
      ...deviceParseData,
      ipAdress: deviceData.ip,
    });
    return resInsered.id;
  }

  async findById(deviceId: number) {
    const deviceData: ITokenDevice = await this.deviceRepository
      .createQueryBuilder()
      .where('id = :deviceId', { deviceId })
      .getOne();

    return deviceData;
  }

  async findByTag(deviceTag: string) {
    const deviceData: ITokenDevice = await this.deviceRepository
      .createQueryBuilder()
      .where('tag = :deviceTag', { deviceTag })
      .getOne();

    return deviceData;
  }

  async deleteById(deviceId: number) {
    const resDeleted = await this.deviceRepository
      .createQueryBuilder()
      .delete()
      .where('id = :deviceId', { deviceId })
      .execute();
    return !!resDeleted.affected;
  }

  async update(deviceData: ITokenDevice) {
    const resUpdate = await this.deviceRepository
      .createQueryBuilder()
      .update()
      .set({
        ...(deviceData.tag && { tag: deviceData.tag }),
        ...(deviceData.brand && { brand: deviceData.brand }),
        ...(deviceData.model && { model: deviceData.model }),
        ...(deviceData.osName && { brand: deviceData.osName }),
        ...(deviceData.osVersion && { brand: deviceData.osVersion }),
      })
      .where('id = :deviceId', { deviceId: deviceData.id })
      .execute();

    return !!resUpdate.affected;
  }
}
