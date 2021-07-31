import type { ICollection } from './persistence';

import config from '../config';
import { getBasicMetadata, BasicMetadata } from './metadata';

export async function getFile(box: 'new' | 'existing') {
  try {
    let fileHandles = await window.showOpenFilePicker({
      multiple: true,
      // TODO: Replace with SNOWPACK_PUBLIC_RECOGNIZED_EXTENSIONS somehow. Maybe don't use regex.
      types: [
        {
          accept: {
            'audio/*': [
              '.wav',
              '.wave',
              '.mp3',
              '.m4a',
              '.m4b',
              '.m4p',
              '.m4r',
              '.aac',
              '.oga',
              '.ogg',
              '.spx',
              '.opus',
              '.flac',
              '.caf',
            ],
          },
          description: 'All Music Files',
        },
      ],
    });

    return { box, items: fileHandles };
  } catch (error) {
    return { box: '', items: [] };
  }
}

export async function getFolder() {
  try {
    const fileSystemDirectoryHandle = await window.showDirectoryPicker();

    return { box: 'scan', items: [fileSystemDirectoryHandle] };
  } catch (error) {
    return { box: '', items: [] };
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
    const metadata = (
      await Promise.allSettled(
        audioFiles.map(async (h) => getBasicMetadata(await h.getFile())),
      )
    )
      .filter(
        (r): r is PromiseFulfilledResult<BasicMetadata> =>
          r.status === 'fulfilled',
      )
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
  const collections: ICollection[] = [];

  const { files: rootFiles, folders: rootFolders } =
    separateFileSystemEntries(handles);

  const rootAudioFiles = filterAudioFiles(rootFiles);
  const metadata = (
    await Promise.allSettled(
      rootAudioFiles.map(async (h) => getBasicMetadata(await h.getFile())),
    )
  )
    .filter(
      (r): r is PromiseFulfilledResult<BasicMetadata> =>
        r.status === 'fulfilled',
    )
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
