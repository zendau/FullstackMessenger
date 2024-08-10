export interface IDeleteMessage {
  deletedData: IDeletedData[];
  roomId: string;
}

export interface IDeletedData {
  isRead: boolean;
  id: number;
}
