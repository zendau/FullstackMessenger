export default interface IToken {
  id: number;
  email: string;
  login: string;
  role:  string;
  isBanned: boolean;
  info: {
    phone?: string;
    details?: string;
  };
  deviceId?: number;
  iat?: number;
  exp?: number;
}
