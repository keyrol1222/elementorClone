export type StorageUploadResult = {
  key: string;
  url: string;
  size: number;
  mimeType: string;
};

export type StorageProvider = {
  upload: (
    file: Buffer,
    filename: string,
    mimeType: string,
    userId: string,
  ) => Promise<StorageUploadResult>;
  delete: (key: string) => Promise<void>;
  getUrl: (key: string) => string;
};

export type StorageConfig = {
  provider: "local" | "s3" | "r2";
  localPath?: string;
  publicPath?: string;
  bucket?: string;
  region?: string;
  endpoint?: string;
};
