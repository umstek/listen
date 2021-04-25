import type { ICollection } from './persistence';

import config from '../config';

export async function getFileSystemEntries(items: DataTransferItemList) {
  return await Promise.all(
    Object.keys(items)
      .map((i) => items[Number(i)])
      .filter((item) => item.kind === 'file') // file or folder, not a string
      .map((f) => f.getAsFileSystemHandle()),
  );
}

export function separateFileSystemEntries(fileSystemEntries: any[]) {
  const folders = fileSystemEntries.filter(
    (entry) => entry.kind === 'directory',
  );
  const files = fileSystemEntries.filter((entry) => entry.kind === 'file');

  return { folders, files };
}

export async function iterateDirectory(directoryHandle: any) {
  const iterator = directoryHandle.entries();

  const entries = [];

  while (true) {
    const result = await iterator.next();
    if (result.done) {
      break;
    }

    entries.push(result.value[1]);
  }

  return entries;
}

export function filterAudioFiles(files: any[]) {
  return files.filter((file) => config.recognizedExtensions.exec(file.name));
}

export async function scanEntries(queue: any[]) {
  const collections: ICollection[] = [];

  while (queue.length > 0) {
    const directory = queue.shift();

    const entries = await iterateDirectory(directory);
    const { files, folders } = separateFileSystemEntries(entries);

    const audioFiles = filterAudioFiles(files);
    if (audioFiles.length > 0) {
      collections.push({
        name: directory.name,
        files: audioFiles,
        folders,
        hidden: {},
      });
    }

    queue.push(...folders);
  }

  return collections;
}

export async function scanDroppedItems(entries: any[]) {
  const collections: ICollection[] = [];

  const { files: rootFiles, folders: rootFolders } = separateFileSystemEntries(
    entries,
  );

  const rootAudioFiles = filterAudioFiles(rootFiles);
  if (rootAudioFiles.length > 0) {
    collections.push({
      name: 'root',
      files: rootAudioFiles,
      folders: rootFolders,
      hidden: {},
    });
  }

  collections.push(...(await scanEntries(rootFolders)));
  return collections;
}
