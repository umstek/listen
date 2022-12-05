import { collections } from './persistence';
import { type Playlist } from '../models/playlistSchema';
import { MangoQuery } from 'rxdb';

async function insert(data: Playlist) {
  return collections.playlist.insert(data);
}

async function bulkInsert(data: Playlist[]) {
  return collections.playlist.bulkInsert(data);
}

async function find(query: MangoQuery<Playlist>): Promise<Playlist[]> {
  return collections.playlist.find(query).exec();
}

export { insert, bulkInsert, find };
