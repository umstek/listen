import type { ICollection } from './persistence';

import config from '../config';

export async function getFileSystemEntries(
  items: DataTransferItemList,
): Promise<FileSystemHandle[]> {
  const handles = await Promise.all(
    Object.keys(items)
      .map((i) => items[Number(i)])
      .filter((item) => item.kind === 'file') // file or folder, not a string
      .map((dti) => dti.getAsFileSystemHandle()),
  );

  return handles.filter((h): h is FileSystemHandle => Boolean(h));
}

export function separateFileSystemEntries(
  fileSystemHandles: FileSystemHandle[],
) {
  const folders = fileSystemHandles.filter(
    (entry): entry is FileSystemDirectoryHandle => entry.kind === 'directory',
  );
  const files = fileSystemHandles.filter(
    (entry): entry is FileSystemFileHandle => entry.kind === 'file',
  );

  return { folders, files };
}

export async function iterateDirectory(
  directoryHandle: FileSystemDirectoryHandle,
) {
  const values = [];
  for await (const fileSystemHandle of directoryHandle.values()) {
    values.push(fileSystemHandle);
  }

  return values;
}

export function filterAudioFiles(files: FileSystemFileHandle[]) {
  return files.filter((file) => config.recognizedExtensions.exec(file.name));
}

export async function scanEntries(queue: FileSystemDirectoryHandle[]) {
  const collections: ICollection[] = [];

  while (queue.length > 0) {
    const directory = queue.shift()!;

    const entries = await iterateDirectory(directory);
    const { files, folders } = separateFileSystemEntries(entries);

    const audioFiles = filterAudioFiles(files);
    if (audioFiles.length > 0) {
      collections.push({
        name: directory.name,
        files: audioFiles,
        folders,
        hidden: {},
        ordered: {},
      });
    }

    queue.push(...folders);
  }

  return collections;
}

export async function scanDroppedItems(handles: FileSystemHandle[]) {
  const collections: ICollection[] = [];

  const { files: rootFiles, folders: rootFolders } = separateFileSystemEntries(
    handles,
  );

  const rootAudioFiles = filterAudioFiles(rootFiles);
  if (rootAudioFiles.length > 0) {
    collections.push({
      name: 'root',
      files: rootAudioFiles,
      folders: rootFolders,
      hidden: {},
      ordered: {},
    });
  }

  collections.push(...(await scanEntries(rootFolders)));
  return collections;
}

export async function requestPermission(entry: any, mode: string) {
  let currentStatus = await entry.queryPermission({ mode });
  if (currentStatus !== 'granted') {
    currentStatus = await entry.requestPermission({ mode });
  }
  return currentStatus;
}

export async function deleteEntry(folder: any, entry: any) {
  await folder.removeEntry(entry.name, entry.kind === 'directory');
}
