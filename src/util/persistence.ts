import Dexie from 'dexie';
import type { BasicMetadata } from './metadata';

export interface HistoricalEvent {
  collection: string;
  path: string;
  fileName: string;
  title: string;
  file: FileSystemFileHandle;
  position: number; // milliseconds? we ought to seek to a few seconds earlier position
  time: number; // epoch time
}

export interface ICollection {
  name: string;
  folders: FileSystemDirectoryHandle[];
  files: FileSystemFileHandle[];
  metadata: BasicMetadata[];
  hidden: { [path: string]: string[] };
  ordered: { [path: string]: string[] };
}

class MainDatabase extends Dexie {
  collections: Dexie.Table<ICollection, string>;
  history: Dexie.Table<HistoricalEvent, number>;

  constructor() {
    super('main');
    this.version(1).stores({
      collections: 'name',
      history: '++id,time,collection,path,fileName',
    });

    this.collections = this.table('collections');
    this.history = this.table('history');
  }
}

export const db = new MainDatabase();
