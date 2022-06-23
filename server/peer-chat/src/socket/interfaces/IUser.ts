export default interface IUser {
  userLogin: string;
  roomId?: string;
  peerId?: string;
  userId: string;
  mute?: boolean;
  pause?: boolean;
  isMainFrame?: boolean;
}
