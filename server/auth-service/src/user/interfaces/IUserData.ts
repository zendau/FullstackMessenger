export default interface IUser {
  id?: number;
  email: string;
  login?: string;
  password: string;
  confirmPassword?: string;
  roleId?: number;
}
