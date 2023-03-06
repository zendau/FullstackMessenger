export default interface IPublicUserData {
  email: string;
  id: number;
  info?: {
    phone: string,
    details: string
  };
  lastOnline: string;
  login: string;
  role: string;
  peerId: string
}
