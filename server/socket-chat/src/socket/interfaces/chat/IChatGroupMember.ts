import IUserChat from '../user/IUserChat';

export default interface IChatGroupMember extends IUserChat {
  adminId: number;
}
