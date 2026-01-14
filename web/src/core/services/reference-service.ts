import {
  createCatalogDb,
  type Color,
  type Discount,
  type MeasurementUnit,
} from "@/lib/dal";

type ReferenceServiceType = {
  getColors(): Promise<Color[]>;
  getMeasurementUnits(): Promise<MeasurementUnit[]>;
  getDiscounts(): Promise<Discount[]>;
};

const getReferenceService = (): ReferenceServiceType => {
  return {
    getColors: (): Promise<Color[]> => {
      return new Promise((resolve, reject) => {
        try {
          const db = createCatalogDb(process.env.DB_CATALOG_PATH);
          const colors = db.query.colors.findMany();
          resolve(colors);
        } catch (error) {
          console.error(error);
          reject("Failed to fetch Colors");
        }
      });
    },
    getMeasurementUnits: (): Promise<MeasurementUnit[]> => {
      return new Promise((resolve, reject) => {
        try {
          const db = createCatalogDb(process.env.DB_CATALOG_PATH);
          const measurementUnits = db.query.measurementUnits.findMany();
          resolve(measurementUnits);
        } catch (error) {
          console.error(error);
          reject("Failed to fetch Measurement Units");
        }
      });
    },
    getDiscounts: (): Promise<Discount[]> => {
      return new Promise((resolve, reject) => {
        try {
          const db = createCatalogDb(process.env.DB_CATALOG_PATH);
          const discounts = db.query.discounts.findMany();
          resolve(discounts);
        } catch (error) {
          console.error(error);
          reject("Failed to fetch Discounts");
        }
      });
    },
  };
  //const colors = (await crea.query.colors.findMany()) as Colors[];
};
