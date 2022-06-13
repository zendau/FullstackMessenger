import IUser from "./IUserData";

export default interface IEditUser extends IUser {
  newEmail: string
}