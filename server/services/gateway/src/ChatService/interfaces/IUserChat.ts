import IUser from "@/AuthService/UserModule/interfaces/IUser";

export default interface IUserChat {
  chatId: string;
  users: IUser[]
}
