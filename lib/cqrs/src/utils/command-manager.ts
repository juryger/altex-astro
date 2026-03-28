import {
  DatabaseType,
  type CatalogDb,
  type OperatioinsDb,
  type GeneralDb,
  createCatalogDb,
  type DatabaseTransaction,
  type DatabaseSchema,
} from "@/lib/dal";
import {
  delay,
  EnvironmentNames,
  FailedResult,
  getErrorMessage,
  OkResult,
  regexTrue,
  selectEnvironment,
  type Result,
} from "@/lib/domain";
import { type CommandManager } from "../core";

const withTracing = regexTrue.test(
  selectEnvironment(EnvironmentNames.ENABLE_TRACING),
);

function getCommandManager(): CommandManager {
  return {
    mutate: async <T = any>(
      commandFn: () => Promise<T>,
    ): Promise<Result<T>> => {
      try {
        return OkResult(await commandFn());
      } catch (error) {
        console.error(error);
        const errorMessage = getErrorMessage(error);
        console.error(
          "~ command-manager ~ Failed to execute command against database, see deatils below.",
          errorMessage,
        );
        return FailedResult(new Error(errorMessage));
      }
    },
    mutateTransactional: <T = any>(
      type: DatabaseType,
      commands: Array<
        (x: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
      >,
    ): Result<T> => {
      const db = getDatabase(type);
      if (db === undefined) {
        return FailedResult(new Error(`Unsupported database type: ${type}`));
      }
      return db.transaction((tx) => {
        try {
          let prevResult: any | undefined = undefined;
          for (let i = 0; i < commands.length; i++) {
            const fn = commands[i];
            withTracing &&
              console.log(
                "🐾 ~ command-manager ~ transaction command: %i of %i, prev command result: %s",
                i,
                commands.length,
                prevResult,
              );
            if (fn !== undefined) {
              prevResult = fn(tx, prevResult);
            }
          }
          withTracing &&
            console.log(
              "🐾 ~ command-manager ~ transaction result: %s",
              prevResult,
            );
          return OkResult<T>(prevResult);
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

export { getCommandManager };
