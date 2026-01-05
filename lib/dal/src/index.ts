import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import type { Category } from "./schema/catalog";

console.log("~ DAL ~ init");
console.log("~ DAL ~ general: %s", process.env.DB_GENERAL_PATH);
const clientGeneral = new Database(process.env.DB_GENERAL_PATH, {
  fileMustExist: false,
});
clientGeneral.pragma("journal_mode = WAL");
const dbGeneral = drizzle({ client: clientGeneral });

// const clientCatalog = new Database(process.env.DB_CATALOG_PATH, {
//   readonly: true,
// });
// clientCatalog.pragma("journal_mode = WAL");
// const dbCatalogMaster = drizzle({
//   client: clientCatalog,
// });

// const clientTrade = new Database(process.env.DB_TRADE_PATH);
// clientTrade.pragma("journal_mode = WAL");
// const dbTrade = drizzle({
//   client: clientTrade,
// });

// const clientOperational = new Database(process.env.DB_OPERATIONAL_PATH);
// clientOperational.pragma("journal_mode = WAL");
// const dbOperational = drizzle({
//   client: clientOperational,
// });

// const cat: Category | undefined = undefined;

// const replica = clientOperational
//   .prepare("SELECT * FROM read_replicas WHERE id = ?")
//   .get("catalog") as ReadReplica;
//console.log("~ DAL ~ catalog replica %o", replica.value);

// const clientCatalogReplica = new Database(
//   process.env.DB_CATALOG_PATH + "/" + replica.value
// );
// clientCatalogReplica.pragma("journal_mode = WAL");
// const dbCatalogCurrent = drizzle({
//   client: clientCatalogReplica,
// });

// const clientQueuePoisoned = new Database(process.env.DB_QUEUE_POISONED_PATH);
// clientQueuePoisoned.pragma("journal_mode = WAL");
// const dbQueuePoisoned = drizzle({
//   client: clientQueuePoisoned,
// });

export {
  dbGeneral,
  //dbCatalogMaster,
  //dbTrade,
  //dbOperational,
  //dbCatalogCurrent,
  //dbQueuePoisoned,
};
