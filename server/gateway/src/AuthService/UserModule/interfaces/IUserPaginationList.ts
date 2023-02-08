export default interface IUserPaginationList {
  userId: number;
  page: number | null;
  limit: number | null;
  pattern: string | null;
}
