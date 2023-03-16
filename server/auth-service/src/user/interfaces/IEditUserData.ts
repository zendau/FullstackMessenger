import IToken from '@/token/interfaces/IToken';
import { IDevice } from '@/token/interfaces/ITokenDevice';
import IUserData from './IUserData';

export default interface IEditUserData extends IUserData {
  newEmail?: string;
  phone?: string;
  details? :string;
  tokenData: IToken;
  system: IDevice
}
