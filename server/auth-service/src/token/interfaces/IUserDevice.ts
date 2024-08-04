import IDeviceData from "./IDeviceData";

export interface IUserDevice extends IDeviceData {
  lastOnline: string;
  ipAdress: string;
}
