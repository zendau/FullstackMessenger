import IUserData from './IUserData';

export default interface IUserConnectData {
  userId: number;
  userData: IUserData;
  limit: number;
  chatId?: string;
}
