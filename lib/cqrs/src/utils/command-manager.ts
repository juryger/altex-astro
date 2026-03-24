import {
  DatabaseType,
  type CatalogDb,
  type OperatioinsDb,
  type GeneralDb,
  createCatalogDb,
  type DbTransaction,
} from "@/lib/dal/src";
import {
  EnvironmentNames,
  FailedResult,
  getErrorMessage,
  OkResult,
  selectEnvironment,
  type Result,
} from "@/lib/domain";

interface CommandManager {
  mutate: <T = any>(commandFn: () => Promise<T>) => Promise<Result<T>>;
  mutateTransactional: <T = any>(
    type: DatabaseType,
    commands: Array<(tx: DbTransaction, prevResult?: any) => Promise<any>>,
  ) => Promise<Result<T>>;
}

function getCommandManager(): CommandManager {
  return {
    mutate: async <T = any>(
      commandFn: () => Promise<T>,
    ): Promise<Result<T>> => {
      try {
        return OkResult(await commandFn());
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(
          "~ command-manager ~ Failed to execute command against database, see deatils below.",
          errorMessage,
        );
        return FailedResult(new Error(errorMessage));
      }
    },
    mutateTransactional: async <T = any>(
      type: DatabaseType,
      commands: Array<(x: DbTransaction, prevResult?: any) => Promise<any>>,
    ): Promise<Result<T>> => {
      const db = getDatabase(type);
      if (db === undefined) {
        return FailedResult(new Error(`Unsupported database type: ${type}`));
      }
      return await db.transaction(async (tx) => {
        try {
          let prevResult: any | undefined = undefined;
          for (let i = 0; i < commands.length; i++) {
            const fn = commands[i];
            if (fn !== undefined) {
              prevResult = await fn(tx, prevResult);
            }
          }
          return OkResult(prevResult as T);
        } catch (error) {
          tx.rollback();
          const errorMessage = getErrorMessage(error);
          console.error(
            "~ command-manager ~ Failed to execute transactional commands against database, see deatils below.",
            errorMessage,
          );
          return FailedResult<T>(new Error(errorMessage));
        }
      });
    },
  };
}

const getDatabase = (
  type: DatabaseType,
): CatalogDb | GeneralDb | OperatioinsDb | undefined => {
  let result: CatalogDb | GeneralDb | OperatioinsDb | undefined;
  switch (type) {
    case DatabaseType.Catalog:
      result = createCatalogDb(
        selectEnvironment(EnvironmentNames.DB_CATALOG_PATH),
      );
      break;
    case DatabaseType.General:
      result = createCatalogDb(
        selectEnvironment(EnvironmentNames.DB_GENERAL_PATH),
      );
      break;
    case DatabaseType.Operatons:
      result = createCatalogDb(
        selectEnvironment(EnvironmentNames.DB_OPERATIONS_PATH),
      );
      break;
    default:
      break;
  }
  return result;
};

export { type CommandManager, getCommandManager };
