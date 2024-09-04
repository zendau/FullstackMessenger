export default interface IUser {
  id: number;
  email: string;
  login: string;
  lastOnline: Date | string;
  peerId?: string;
}
