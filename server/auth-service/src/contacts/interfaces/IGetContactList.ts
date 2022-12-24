export default interface IGetContactList {
  userId: number;
  page: number;
  limit: number;
  pattern: string | null;
}
