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
      await fs.stat(filePath);
      this.withTracing &&
        console.log("🐾 ~ file-manager ~ file does exist '%s'", filePath);
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
    if (path.extname(srcPath) === FILE_EXTENSIION_DB) {
      const paths = await this.expandDbFiles(srcPath);
      await fs.mkdir(path.dirname(dstPath), { recursive: true });
      for (const itemPath of paths) {
        const modifiedDstPath = path.join(
          path.dirname(dstPath),
          `${path.basename(dstPath, FILE_EXTENSIION_DB)}${path.extname(itemPath)}`,
        );
        this.withTracing &&
          console.log(
            "🐾 ~ file-manager ~ copy from '%s' to '%s'",
            itemPath,
            modifiedDstPath,
          );
        await fs.copyFile(itemPath, modifiedDstPath);
      }
      return;
    }
    this.withTracing &&
      console.log(
        "🐾 ~ file-manager ~ copy from '%s' to '%s'",
        srcPath,
        dstPath,
      );
    await fs.mkdir(path.dirname(dstPath), { recursive: true });
    await fs.copyFile(srcPath, dstPath);
  }

  async move(srcPath: string, dstPath: string): Promise<void> {
    const isFileExist = await this.checkExistence(srcPath);
    if (!isFileExist) {
      return Promise.reject(`Specified path is not exist '${srcPath}'`);
    }
    if (path.extname(srcPath) === FILE_EXTENSIION_DB) {
      const paths = await this.expandDbFiles(srcPath);
      for (const itemPath of paths) {
        const modifiedDstPath = path.join(
          path.dirname(dstPath),
          `${path.basename(dstPath, FILE_EXTENSIION_DB)}${path.extname(itemPath)}`,
        );
        this.withTracing &&
          console.log(
            "🐾 ~ file-manager ~ move from '%s' to '%s'",
            itemPath,
            modifiedDstPath,
          );
        await this.copy(itemPath, modifiedDstPath);
        await fs.unlink(itemPath);
      }
      return;
    }
    this.withTracing &&
      console.log(
        "🐾 ~ file-manager ~ move from '%s' to '%s'",
        srcPath,
        dstPath,
      );
    await this.copy(srcPath, dstPath);
    await fs.unlink(srcPath);
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
    if (path.extname(filePath) === FILE_EXTENSIION_DB) {
      const paths = await this.expandDbFiles(filePath);
      for (const itemPath of paths) {
        this.withTracing &&
          console.log("🐾 ~ file-manager ~ remove of '%s'", itemPath);
        await fs.rm(itemPath, { force: true, recursive: false });
      }
      return;
    }
    this.withTracing &&
      console.log(
        "🐾 ~ file-manager ~ remove of '%s', isDirectory: %s",
        filePath,
        isDirectory,
      );
    await fs.rm(filePath, { force: true, recursive: isDirectory });
  }

  private async expandDbFiles(filePath: string): Promise<string[]> {
    const result: string[] = [filePath];
    const walFilePath = path.join(
      path.dirname(filePath),
      `${path.basename(filePath, FILE_EXTENSIION_DB)}${FILE_EXTENSIION_DB_WAL}`,
    );
    const shmFilePath = path.join(
      path.dirname(filePath),
      `${path.basename(filePath, FILE_EXTENSIION_DB)}${FILE_EXTENSIION_DB_SHM}`,
    );
    if (await this.checkExistence(walFilePath)) result.push(walFilePath);
    if (await this.checkExistence(shmFilePath)) result.push(shmFilePath);
    this.withTracing &&
      console.log(
        "🐾 ~ file-manager ~ expanding coverage of db file '%s', result: '%o'",
        filePath,
        result,
      );
    return result;
  }
}
