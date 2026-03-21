import type { BaseImageUploader } from "../core";

export const getS3ImageUploader = (): BaseImageUploader => {
  return {
    upload: async (filePath: string, dstPath: string): Promise<void> => {
      throw new Error("s3-image-uploader: not implemented");
    },
  };
};
