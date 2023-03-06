import { IDevice } from "@/token/interfaces/ITokenDevice";

export default interface IUserData {
  id?: number;
  email: string;
  login?: string;
  password?: string;
  confirmCode?: string;
  system: IDevice;
}