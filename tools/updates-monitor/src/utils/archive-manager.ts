import path from "path";
import unzipper from "unzipper";
import { FILE_EXTENSIION_ZIP } from "@/lib/domain";
import { type BaseArchiveManager, type BaseFileManager } from "../core";
import { FileManager } from "./file-manager";

export class ZipManager implements BaseArchiveManager {
  private static __instance: BaseArchiveManager;
  private fileManager: BaseFileManager;
  private withTracing: boolean;

  constructor(withTracing: boolean) {
    this.withTracing = withTracing;
    this.fileManager = FileManager.instance();
  }

  static instance(withTracing: boolean = false) {
    if (!ZipManager.__instance) {
      ZipManager.__instance = new ZipManager(withTracing);
    }
    return ZipManager.__instance;
  }

  private async unzipFile(filePath: string): Promise<string> {
    const dirPath = path.dirname(filePath);
    const fileName = path.basename(filePath, FILE_EXTENSIION_ZIP);
    const extractedPath = path.join(dirPath, fileName);
    const directory = await unzipper.Open.file(filePath);
    await directory.extract({ path: extractedPath });
    return extractedPath;
  }

  public async extract(filePath: string): Promise<string> {
    const extractedPath = await this.unzipFile(filePath);
    this.withTracing &&
      console.log(
        "🐾 ~ archive-manager ~ unzip file '%s', to directory '%s'",
        filePath,
        extractedPath,
      );
    return Promise.resolve(extractedPath);
  }

  public async cleanUp(filePath: string): Promise<void> {
    const dirPath = path.dirname(filePath);
    console.log(
      "🐾 ~ archive-manager ~ clean up zip file '%s' and extracted directory '%s'",
      filePath,
      dirPath,
    );
    await this.fileManager.remove({ filePath });
    await this.fileManager.remove({
      filePath: path.join(
        dirPath,
        path.basename(filePath, FILE_EXTENSIION_ZIP),
      ),
    });
    return Promise.resolve();
  }
}
