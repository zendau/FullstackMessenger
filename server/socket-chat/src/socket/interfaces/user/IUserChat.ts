import IUser from 'src/chat/interfaces/IUser';

export default interface IUserChat {
  userId: number;
  chatId: string;
  users: IUser[];
}
