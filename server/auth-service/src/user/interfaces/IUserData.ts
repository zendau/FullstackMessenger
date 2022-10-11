import { IDevice } from "src/token/interfaces/ITokenDevice";

export default interface IUser {
  id?: number;
  email: string;
  login?: string;
  password?: string;
  confirmId?: string;
  confirmCode?: string;
  system: IDevice;

}

