import IUser from "src/AuthService/UserModule/interfaces/IUser";

export default interface IUserChat {
  userId: number;
  chatId: string;
  users: IUser[]
}
