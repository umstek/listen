import type {} from './database/persistence';

import config from '../config';
import { getMetadata } from './metadata';
import { isPromiseFulfilled } from './typeUtils';

export async function getFiles() {
  try {
    const fileHandles = await window.showOpenFilePicker({
      multiple: true,
      types: [
        {
          accept: { 'audio/*': config.recognizedExtensionsList },
          description: 'All Music Files',
        },
      ],
    });

    return fileHandles;
  } catch (error) {
    return [];
  }
}

export async function getFolder() {
  try {
    return await window.showDirectoryPicker();
  } catch (error) {
    return undefined;
  }
}

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

export async function getDirectoryEntries(
  directoryHandle: FileSystemDirectoryHandle,
) {
  const values = [];
  for await (const fileSystemHandle of directoryHandle.values()) {
    values.push(fileSystemHandle);
  }

  return values;
}

export async function scanEntries(queue: FileSystemDirectoryHandle[]) {
  const collections: any[] = [];

  for (let directory = queue.shift(); directory; directory = queue.shift()) {
    const entries = await getDirectoryEntries(directory);
    const { files, folders } = separateFileSystemEntries(entries);

    const audioFiles = filterAudioFiles(files);
    const metadata = (
      await Promise.allSettled(
        audioFiles.map(async (h) => getMetadata(await h.getFile())),
      )
    )
      .filter(isPromiseFulfilled)
      .map((r) => r.value);

    if (audioFiles.length > 0) {
      collections.push({
        name: directory.name,
        folders,
        files: audioFiles,
        metadata,
        hidden: {},
        ordered: {},
      });
    }

    queue.push(...folders);
  }

  return collections;
}

export async function scanDroppedItems(handles: FileSystemHandle[]) {
  const collections: any[] = [];

  const { files: rootFiles, folders: rootFolders } =
    separateFileSystemEntries(handles);

  const rootAudioFiles = filterAudioFiles(rootFiles);
  const metadata = (
    await Promise.allSettled(
      rootAudioFiles.map(async (h) => getMetadata(await h.getFile())),
    )
  )
    .filter(isPromiseFulfilled)
    .map((r) => r.value);
  if (rootAudioFiles.length > 0) {
    collections.push({
      name: 'root',
      folders: rootFolders,
      files: rootAudioFiles,
      metadata,
      hidden: {},
      ordered: {},
    });
  }

  collections.push(...(await scanEntries(rootFolders)));
  return collections;
}

/**
 * Traverses through a directory and yields files and folders (in undefined
 * order)
 *
 * @param folder folder to traverse
 */
export async function* getEntriesRecursively(
  folder: FileSystemDirectoryHandle,
): AsyncGenerator<[string[], FileSystemFileHandle], void, unknown> {
  for await (const [key, entry] of folder.entries()) {
    if (entry.kind === 'directory') {
      for await (const [path, file] of getEntriesRecursively(entry)) {
        yield [[folder.name, ...path], file];
      }
    } else {
      yield [[folder.name], entry];
    }
  }
}

/**
 * Separate files and folders from a list of handles
 *
 * @param fileSystemHandles files and folders
 * @returns files and folders separated
 */
export function separateFileSystemEntries(
  fileSystemHandles: FileSystemHandle[],
) {
  return {
    folders: fileSystemHandles.filter(
      (entry): entry is FileSystemDirectoryHandle => entry.kind === 'directory',
    ),
    files: fileSystemHandles.filter(
      (entry): entry is FileSystemFileHandle => entry.kind === 'file',
    ),
  };
}

/**
 * Get audio files only
 *
 * @param files a list of file handles
 * @returns audio files
 */
export function filterAudioFiles(files: FileSystemFileHandle[]) {
  return files.filter((file) =>
    config.recognizedExtensionsRegex.exec(file.name),
  );
}

/**
 * Checks whether the site is allowed to access a file or a folder, and tries
 * asking the user once if not.
 *
 * @param handle Item to take permission for
 * @param mode Read or write permission that is required
 * @returns whether the item can be accessed
 */
export async function requestPermission(
  handle: FileSystemHandle,
  mode: FileSystemPermissionMode,
): Promise<PermissionState> {
  return (await handle.queryPermission({ mode })) === 'granted'
    ? 'granted'
    : handle.requestPermission({ mode });
}

/**
 * Deletes a file, or a folder recursively
 *
 * @param parent Immediate containing folder of the item to delete
 * @param toDelete The file or folder handle to delete
 */
export async function deleteEntry(
  parent: FileSystemDirectoryHandle,
  toDelete: FileSystemHandle,
) {
  return parent.removeEntry(toDelete.name, {
    recursive: toDelete.kind === 'directory',
  });
}
