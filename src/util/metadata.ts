import { IAudioMetadata } from 'music-metadata-browser';

export interface FileMetadata {
  path: string;
  name: string;
  type: string;
  size: number;
  hash: string;
  lastModified: number;
}

export interface BasicAudioMetadata {
  genre: string[];
  artists: string[];
  album: string;
  title: string;
  trackNumber: number;
  duration: number;
}

const kiB = 2 ** 10;
const MiB = kiB * 2 ** 10;

async function getFileHash(file: File) {
  const hashingDataStart = file.size > 2 * MiB ? 1 * MiB : 0;
  const hashingDataEnd = hashingDataStart + 1 * kiB;
  const hashingData = await file
    .slice(hashingDataStart, hashingDataEnd)
    .arrayBuffer();

  const hashAsArrayBuffer = await crypto.subtle.digest('SHA-256', hashingData);
  return Buffer.from(hashAsArrayBuffer).toString('base64');
}

async function getFileMetadata(file: File): Promise<FileMetadata> {
  const { name, type, size, lastModified, webkitRelativePath } = file;
  const hash = await getFileHash(file);
  return { path: webkitRelativePath, name, type, size, lastModified, hash };
}

async function getAudioMetadata(
  file: File,
): Promise<[BasicAudioMetadata, IAudioMetadata]> {
  const mmb = await import('music-metadata-browser');
  const metadata = await mmb.parseBlob(file, {
    duration: true,
    includeChapters: true,
  });
  const {
    common: {
      genre = [],
      artists = [],
      album = '',
      title = '',
      track: { no },
    },
    format: { duration = 0 },
  } = metadata;

  return [
    {
      genre,
      artists,
      album,
      trackNumber: no || 0,
      title,
      duration,
    },
    metadata,
  ];
}

export async function getMetadata(file: File) {
  const fileMetadata = await getFileMetadata(file);
  const [basicAudioMetadata, rawAudioMetadata] = await getAudioMetadata(file);

  return { fileMetadata, basicAudioMetadata, rawAudioMetadata };
}
