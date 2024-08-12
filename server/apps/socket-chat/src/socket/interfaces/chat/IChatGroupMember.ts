import IUserChat from '@/socket/interfaces/user/IUserChat';

export default interface IChatGroupMember extends IUserChat {
  adminId: number;
}
