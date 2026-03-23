import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import type { BaseImageManager } from "../core";
import path from "path";
import fs from "fs";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export const getS3ImageManager = (): BaseImageManager => {
  const s3Client = new S3Client({
    apiVersion: "latest",
    endpoint: selectEnvironment(EnvironmentNames.S3_ENDPOINT_URL),
    credentials: {
      accessKeyId: selectEnvironment(EnvironmentNames.S3_ACCESS_KEY_ID),
      secretAccessKey: selectEnvironment(
        EnvironmentNames.S3_SECRETE_ACCESS_KEY,
      ),
    },
  });
  return {
    upload: async (
      filePath: string,
      isThumbnail: boolean = false,
    ): Promise<void> => {
      const content = fs.readFileSync(filePath);
      return await s3Client
        .send(
          new PutObjectCommand({
            Bucket: selectEnvironment(
              isThumbnail
                ? EnvironmentNames.S3_BUCKET_THUMBNAILS
                : EnvironmentNames.S3_BUCKET_IMAGES,
            ),
            Key: path.basename(filePath),
            ContentType: "image/jpeg",
            Body: content,
          }),
        )
        .then((value) => Promise.resolve())
        .catch((reason) => Promise.reject(reason));
    },
    delete: async (
      fileName: string,
      isThumbnail: boolean = false,
    ): Promise<void> => {
      const command = new DeleteObjectCommand({
        Bucket: selectEnvironment(
          isThumbnail
            ? EnvironmentNames.S3_BUCKET_THUMBNAILS
            : EnvironmentNames.S3_BUCKET_IMAGES,
        ),
        Key: fileName,
      });
      await s3Client
        .send(command)
        .then(() => Promise.resolve())
        .catch((reason) => Promise.reject(reason));
    },
  };
};
