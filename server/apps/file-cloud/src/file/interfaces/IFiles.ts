export default interface IFiles {
  filesData: IFile[];
  path: string;
  userId: number;
}

export interface IFile {
  mimetype: string;
  fileName: string;
  fileTempName: string;
  size: number;
}
