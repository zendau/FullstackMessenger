export default interface IUser {
  id?: number;
  email: string;
  login?: string;
  password?: string;
  confirmPassword?: string;
  confirmId?: string;
  confirmCode?: string;
}
