export default interface IGetContactList {
  userId: number;
  page: number | null;
  limit: number | null;
  pattern: string | null;
}
