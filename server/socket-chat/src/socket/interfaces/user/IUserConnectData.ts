import IUserData from './IUserData';

export default interface IUserConnectData {
  userId: number;
  limit: number;
  chatId?: string;
}
