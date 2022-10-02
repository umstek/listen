export async function getMetadata(file: File) {
  const metadata = (await import('music-metadata-browser')).parseBlob(file, { duration: true });
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
  } = await (await import('music-metadata-browser')).parseBlob(file);
  return { artist, album, trackNumber, title, duration };
}
