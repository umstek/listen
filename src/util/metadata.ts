import * as mmb from 'music-metadata-browser';

export async function getMetadata(file: File) {
  const metadata = await mmb.parseBlob(file, { duration: true });
  return metadata;
}

export interface BasicMetadata {
  artist?: string;
  album?: string;
  trackNumber?: number | null;
  title?: string;
  duration?: number;
}

export async function getBasicMetadata(file: File): Promise<BasicMetadata> {
  const {
    common: {
      artist,
      album,
      track: { no: trackNumber },
      title,
    },
    format: { duration },
  } = await mmb.parseBlob(file);
  return { artist, album, trackNumber, title, duration };
}
