import { parseBlob } from 'music-metadata-browser';

export async function getMetadata(file: File) {
  const metadata = await parseBlob(file);
  return metadata;
}

export async function getBasicMetadata(file: File) {
  const {
    common: {
      artist,
      album,
      track: { no: trackNumber },
      title,
      picture,
    },
    format: { duration },
  } = await parseBlob(file, { duration: true });
  return { artist, album, trackNumber, title, duration, picture: picture?.[0] };
}
