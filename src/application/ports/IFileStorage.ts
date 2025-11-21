export interface UploadedFile {
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
}

export interface IFileStorage {
  save(file: Express.Multer.File, ticketId: string): Promise<UploadedFile>;
  delete(filePath: string): Promise<void>;
  getPath(filePath: string): string;
}
