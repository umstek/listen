import Dexie from 'dexie';
import type { BasicMetadata } from './metadata';

export interface HistoricalEvent {
  type: 'play' | 'pause' | 'stop' | 'seek' | 'end';
  collection: string;
  title: string;
  path: string;
  file: FileSystemFileHandle;
  seek?: number; // milliseconds? we ought to seek to a few seconds earlier position
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

  constructor() {
    super('main');
    this.version(2).stores({
      collections: '++name,folders,files,hidden,ordered',
    });

    this.collections = this.table('collections');
  }
}

export const db = new MainDatabase();
