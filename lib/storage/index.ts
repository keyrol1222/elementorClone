import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import type { StorageProvider, StorageUploadResult } from "@/types/storage";

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function createStorageKey(userId: string, filename: string): string {
  const timestamp = Date.now();
  const safeName = sanitizeFilename(filename);
  return `${userId}/${timestamp}-${safeName}`;
}

export class LocalStorageProvider implements StorageProvider {
  private readonly uploadDir: string;
  private readonly publicPath: string;

  constructor(uploadDir = "public/uploads", publicPath = "/uploads") {
    this.uploadDir = uploadDir;
    this.publicPath = publicPath;
  }

  async upload(
    file: Buffer,
    filename: string,
    mimeType: string,
    userId: string,
  ): Promise<StorageUploadResult> {
    const key = createStorageKey(userId, filename);
    const filePath = path.join(process.cwd(), this.uploadDir, key);
    const directory = path.dirname(filePath);

    await mkdir(directory, { recursive: true });
    await writeFile(filePath, file);

    return {
      key,
      url: `${this.publicPath}/${key}`,
      size: file.length,
      mimeType,
    };
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(process.cwd(), this.uploadDir, key);
    await unlink(filePath);
  }

  getUrl(key: string): string {
    return `${this.publicPath}/${key}`;
  }
}

export function createStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER ?? "local";

  switch (provider) {
    case "local":
      return new LocalStorageProvider();
    case "s3":
    case "r2":
      throw new Error(
        `${provider.toUpperCase()} storage is not configured yet. Set STORAGE_PROVIDER=local for development.`,
      );
    default:
      return new LocalStorageProvider();
  }
}
