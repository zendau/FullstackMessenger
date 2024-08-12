export default interface IFile {
  created_at: Date;
  fileName: string;
  fileTempName: string;
  foulder: IFoulder;
  id: number;
  mimetype: string;
  size: number;
  updated_at: Date;
  userId: number;
}

interface IFoulder {
  id: number;
  path: string;
}
