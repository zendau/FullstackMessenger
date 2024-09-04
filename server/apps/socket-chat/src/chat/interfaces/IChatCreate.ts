export default interface IChatCreate {
  adminId?: number;
  users: number[];
  groupName?: string;
  conferenceType: boolean;
}
