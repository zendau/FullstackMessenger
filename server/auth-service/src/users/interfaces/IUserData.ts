export default interface IUser {
  email: string;
  password: string;
  confirmPassword: string;
  roleId?: number;
}
