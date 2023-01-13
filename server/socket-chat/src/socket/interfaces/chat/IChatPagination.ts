export default interface IChatPagination {
  userId: number;
  page: string;
  limit: string;
  chatId?: string;
  inMemory: boolean;
}
