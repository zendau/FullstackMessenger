export default interface IGetContactList {
  userId: number;
  page: string | null;
  limit: string | null;
  pattern: string | null;
}
