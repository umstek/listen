import Dexie from 'dexie';

export interface ICollection {
  name: string;
  folders: any[];
  files: any[];
  hidden: { [path: string]: string[] };
}

class MainDatabase extends Dexie {
  collections: Dexie.Table<ICollection, string>;

  constructor() {
    super('main');
    this.version(1).stores({
      collections: '++name,folders,files,hidden',
    });

    this.collections = this.table('collections');
  }
}

export const db = new MainDatabase();
