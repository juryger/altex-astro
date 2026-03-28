import path from "path";
import fs from "fs/promises";
import { type BaseFileManager } from "../core";
import {
  FILE_EXTENSIION_DB,
  FILE_EXTENSIION_DB_WAL,
  FILE_EXTENSIION_DB_SHM,
} from "@/lib/domain";

export class FileManager implements BaseFileManager {
  private static __instance: BaseFileManager;
  private withTracing: boolean;

  constructor(withTracing: boolean) {
    this.withTracing = withTracing;
  }

  static instance(withTracing: boolean = false) {
    if (!FileManager.__instance) {
      FileManager.__instance = new FileManager(withTracing);
    }
    return FileManager.__instance;
  }

  async lookupByExtension(dirPath: string, fileExt: string): Promise<string[]> {
    this.withTracing &&
      console.log(
        "🐾 ~ file-manager ~ lookup files at '%s' by extension '%s'",
        dirPath,
        fileExt,
      );
    const files = await fs.readdir(dirPath);
    console.log("🧪 ~ file-manager ~ all files:", files);
    const filtered = files.filter((file) => path.extname(file) === fileExt);
    const result = filtered.map((x) => path.join(dirPath, x));
    this.withTracing &&
      console.log(
        "🐾 ~ file-manager ~ lookup by extension '%s' at directory '%s' resolved with %o",
        fileExt,
        dirPath,
        result,
      );
    return result;
  }

  async getCreatedDate(filePath: string): Promise<Date | undefined> {
    try {
      const stats = await fs.stat(filePath);
      const creationDate = stats.birthtime;
      this.withTracing &&
        console.log("🐾 ~ file-manager ~ file was created at ", creationDate);
      return Promise.resolve(creationDate);
    } catch (error) {
      console.warn(
        "⚠️ ~ file-manager ~ error getting file stat, it may not exist.",
        error,
      );
      return Promise.reject(
        `Failed to extract date of creation of the file '${filePath}'`,
      );
    }
  }

  async checkExistence(filePath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(filePath);
      const creationDate = stats.birthtime;
      this.withTracing &&
        console.log("🐾 ~ file-manager ~ file was created at ", creationDate);
      return Promise.resolve(true);
    } catch (error) {
      console.warn(
        "⚠️ ~ file-manager ~ error getting file stat, it may not exist.",
        error,
      );
      return Promise.resolve(false);
    }
  }

  async copy(srcPath: string, dstPath: string): Promise<void> {
    const isFileExist = await this.checkExistence(srcPath);
    if (!isFileExist) {
      return Promise.reject(`Specified path is not exist '${srcPath}'`);
    }
    this.withTracing &&
      console.log(
        "🐾 ~ file-manager ~ copy from '%s' to '%s'",
        srcPath,
        dstPath,
      );
    await fs.mkdir(path.dirname(dstPath), { recursive: true });
    await fs.copyFile(srcPath, dstPath, fs.constants.COPYFILE_EXCL);
    return Promise.resolve();
  }

  async move(srcPath: string, dstPath: string): Promise<void> {
    const isFileExist = await this.checkExistence(srcPath);
    if (!isFileExist) {
      return Promise.reject(`Specified path is not exist '${srcPath}'`);
    }
    this.withTracing &&
      console.log(
        "🐾 ~ file-manager ~ move from '%s' to '%s'",
        srcPath,
        dstPath,
      );
    await this.copy(srcPath, dstPath);
    await fs.unlink(srcPath);
    return Promise.resolve();
  }

  async remove({
    filePath,
    isDirectory = false,
  }: {
    filePath: string;
    isDirectory?: boolean;
  }) {
    const isFileExist = await this.checkExistence(filePath);
    if (!isFileExist) {
      console.warn(
        "⚠️ ~ file-manager ~ cannot remove file/directory as it does not not exist.",
        filePath,
      );
      return Promise.resolve();
    }
    this.withTracing &&
      console.log(
        "🐾 ~ file-manager ~ remove of '%s', isDirectory: %s",
        filePath,
        isDirectory,
      );
    if (path.extname(filePath) === FILE_EXTENSIION_DB) {
      // remove wal and shml in addition to db file
      const walFilePath = path.join(
        path.dirname(filePath),
        `${path.basename(filePath, FILE_EXTENSIION_DB)}${FILE_EXTENSIION_DB_WAL}`,
      );
      const shmFilePath = path.join(
        path.dirname(filePath),
        `${path.basename(filePath, FILE_EXTENSIION_DB)}${FILE_EXTENSIION_DB_SHM}`,
      );
      if (await this.checkExistence(walFilePath))
        await fs.rm(walFilePath, { force: true, recursive: false });
      if (await this.checkExistence(shmFilePath))
        await fs.rm(shmFilePath, { force: true, recursive: false });
    }
    await fs.rm(filePath, { force: true, recursive: isDirectory });
  }
}
