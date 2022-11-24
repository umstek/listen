import { addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';

import { metadataSchema } from './models/metadataSchema';
import { playlistSchema } from './models/playlistSchema';
import { historyRecordSchema } from './models/historyRecordSchema';

if (import.meta.env.DEV) {
  const { RxDBDevModePlugin } = await import('rxdb/plugins/dev-mode');
  addRxPlugin(RxDBDevModePlugin);
}

const mainDb = await createRxDatabase({
  name: 'main',
  storage: getRxStorageDexie(),
});

export const collections = await mainDb.addCollections({
  metadata: {
    schema: metadataSchema,
  },
  playlist: {
    schema: playlistSchema,
  },
  historyRecord: {
    schema: historyRecordSchema,
  },
});
