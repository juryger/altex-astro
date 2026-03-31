import fs from "fs";
import path from "path";
import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { EnvironmentNames, regexTrue, selectEnvironment } from "@/lib/domain";
import type { BaseImageManager } from "../core";

const withTracing = regexTrue.test(
  selectEnvironment(EnvironmentNames.ENABLE_TRACING),
);

export const getS3ImageManager = (): BaseImageManager => {
  const s3Client = new S3Client({
    apiVersion: "latest",
    region: "ap-southeast-6",
    endpoint: selectEnvironment(EnvironmentNames.S3_ENDPOINT_URL),
    credentials: {
      accessKeyId: selectEnvironment(EnvironmentNames.S3_ACCESS_KEY_ID),
      secretAccessKey: selectEnvironment(
        EnvironmentNames.S3_SECRETE_ACCESS_KEY,
      ),
    },
  });
  return {
    checkExistance: async (
      fileName: string,
      isThumbnail?: boolean,
    ): Promise<boolean> => {
      withTracing &&
        console.log(
          "🐾 ~ s3-image-uploader ~ check existence of image file with name: '%s', isThumbnail: %s",
          fileName,
          isThumbnail,
        );
      return await s3Client
        .send(
          new HeadObjectCommand({
            Bucket: isThumbnail
              ? EnvironmentNames.S3_BUCKET_THUMBNAILS
              : EnvironmentNames.S3_BUCKET_IMAGES,
            Key: fileName,
          }),
        )
        .then((value) => Promise.resolve(true))
        .catch((reason) => Promise.reject(reason));
    },
    upload: async (
      filePath: string,
      isThumbnail: boolean = false,
    ): Promise<void> => {
      withTracing &&
        console.log(
          "🐾 ~ s3-image-uploader ~ uploading image file: '%s', isThumbnail: %s",
          filePath,
          isThumbnail,
        );
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
      withTracing &&
        console.log(
          "🐾 ~ s3-image-uploader ~ delete image file with name: '%s', isThumbnail: %s",
          fileName,
          isThumbnail,
        );
      await s3Client
        .send(
          new DeleteObjectCommand({
            Bucket: selectEnvironment(
              isThumbnail
                ? EnvironmentNames.S3_BUCKET_THUMBNAILS
                : EnvironmentNames.S3_BUCKET_IMAGES,
            ),
            Key: fileName,
          }),
        )
        .then(() => Promise.resolve())
        .catch((reason) => Promise.reject(reason));
    },
  };
};
