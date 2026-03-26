import path from "path";
import fs from "fs/promises";
import { type BaseFileManager } from "../core";

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

  async lookupByExtension(
    dirPath: string,
    fileExt: string,
  ): Promise<string | null> {
    const files = await fs.readdir(dirPath);
    const filtered = files.filter((file) => path.extname(file) === fileExt);
    const result =
      filtered.length > 0
        ? filtered[0] !== undefined
          ? path.join(dirPath, filtered[0])
          : null
        : null;
    this.withTracing &&
      console.log(
        "🐾 ~ file-manager ~ lookup by extension '%s' at directory '%s' resolved with '%s'",
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
      console.log("File created at:", creationDate);
      return Promise.resolve(creationDate);
    } catch (error) {
      console.error("Error getting file stats:", error);
      return Promise.reject(
        `Failed to extract date of creation of the file '${filePath}'`,
      );
    }
  }

  async copy(srcPath: string, dstPath: string): Promise<void> {
    this.withTracing &&
      console.log(
        "🐾 ~ file-manager ~ copy from '%s' to '%s'",
        srcPath,
        dstPath,
      );
    await fs.mkdir(path.dirname(dstPath), { recursive: true });
    await fs.copyFile(srcPath, dstPath);
    return Promise.resolve();
  }

  async move(srcPath: string, dstPath: string): Promise<void> {
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

  async remove(filePath: string, isDirectory: boolean = false) {
    this.withTracing &&
      console.log(
        "🐾 ~ file-manager ~ remove of '%s', isDirectory: %s",
        filePath,
        isDirectory,
      );
    return fs.rm(filePath, { force: true, recursive: isDirectory });
  }
}
