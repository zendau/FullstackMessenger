export default interface IChatPagination {
  userId: number;
  page: number;
  limit: number;
  chatId?: string;
}
