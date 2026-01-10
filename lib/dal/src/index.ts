//import Database from "better-sqlite3";
//import { drizzle } from "drizzle-orm/better-sqlite3";

console.log("~ DAL ~ init");
console.log("~ DAL ~ general: %s", process.env.DB_GENERAL_PATH);

// const clientGeneral = new Database(process.env.DB_GENERAL_PATH, {
//   fileMustExist: false,
// });

// clientGeneral.pragma("journal_mode = WAL");
// const dbGeneral = drizzle({ client: clientGeneral });

// export { dbGeneral };
