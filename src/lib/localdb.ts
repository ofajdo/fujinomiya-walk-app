import Dexie, { Table } from "dexie";

export interface Items {
  id: string;
}

export class LocationsLocalDB extends Dexie {
  items!: Table<Items>;

  constructor() {
    super("locations");
    this.version(1).stores({
      items: "++id",
    });
  }
}

export const locationsDB = new LocationsLocalDB();
