export default interface IChatPagination {
  userId: number;
  page: string;
  limit: number;
  chatId?: string;
}
