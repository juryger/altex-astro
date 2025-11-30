export interface DateHelperOperations {
  addDays(date: Date, days: number): Date;
  addHours(date: Date, hours: number): Date;
  addMinutes(date: Date, minutes: number): Date;
}

export const getDateHandler = (): DateHelperOperations => {
  return {
    addDays: (date: Date, days: number): Date => {
      const currentDate = date.getDate();
      date.setDate(currentDate + days);
      return date;
    },
    addHours: (date: Date, hours: number): Date => {
      const currentDate = date.getHours();
      date.setHours(currentDate + hours);
      return date;
    },
    addMinutes: (date: Date, minutes: number): Date => {
      const currentDate = date.getMinutes();
      date.setMinutes(currentDate + minutes);
      return date;
    },
  };
};
