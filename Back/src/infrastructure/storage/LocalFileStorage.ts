import { injectable } from 'tsyringe';
import { promises as fs } from 'fs';
import path from 'path';
import { IFileStorage, UploadedFile } from '../../application/ports/IFileStorage';
import { logger } from '../../config/logger';

@injectable()
export class LocalFileStorage implements IFileStorage {
  private readonly uploadDir: string;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
      logger.info(`Created upload directory: ${this.uploadDir}`);
    }
  }

  async save(file: Express.Multer.File, ticketId: string): Promise<UploadedFile> {
    const ticketDir = path.join(this.uploadDir, ticketId);

    // Create ticket directory if it doesn't exist
    try {
      await fs.access(ticketDir);
    } catch {
      await fs.mkdir(ticketDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedFileName}`;
    const filePath = path.join(ticketId, fileName);
    const fullPath = path.join(this.uploadDir, filePath);

    // Save file
    await fs.writeFile(fullPath, file.buffer);

    logger.info(`File saved: ${filePath}`);

    return {
      fileName: file.originalname,
      filePath: filePath,
      mimeType: file.mimetype,
      fileSize: file.size,
    };
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(this.uploadDir, filePath);

    try {
      await fs.unlink(fullPath);
      logger.info(`File deleted: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to delete file: ${filePath}`, error);
      throw new Error(`Failed to delete file: ${filePath}`);
    }
  }

  getPath(filePath: string): string {
    return path.join(this.uploadDir, filePath);
  }
}
