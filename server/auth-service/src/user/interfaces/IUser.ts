export default interface IUser {
  id: number;
  email: string;
  login: string;
  role: string;
  password?: string;
}
