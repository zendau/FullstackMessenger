export default interface IUser {
  email: string;
  login: string;
  password: string;
  confirmPassword: string;
  roleId?: number;
}
