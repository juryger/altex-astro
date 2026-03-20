import fs from "fs/promises";
import path from "path";
import { type BaseFileManager } from "./index";

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
    return filtered.length > 0 ? (filtered[0] ?? null) : null;
  }

  async move(srcPath: string, dstPath: string): Promise<void> {
    await fs.mkdir(dstPath, { recursive: true });
    await fs.copyFile(srcPath, dstPath);
    await fs.unlink(srcPath);
    return Promise.resolve();
  }

  async remove(filePath: string, isDirectory: boolean = false) {
    return fs.rm(filePath, { force: true, recursive: isDirectory });
  }
}
