import IDeviceData from "./IDeviceData";

export interface ITokenDevice extends IDeviceData{
  tag: string;
}

export interface IDevice {
  ip: string;
  system: {
    mobileData: string | null;
    userAgent: string | null;
  };
}
