import IUser from "@/services/auth/UserModule/interfaces/IUser";

export default interface IUserChat {
  chatId: string;
  users: IUser[]
}
