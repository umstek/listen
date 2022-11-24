import { Action, ExplorerActionType } from './actionTypes';
import type { ActionType } from './actionTypes';
import type { State } from './initialState';
import {
  deleteEntry,
  filterAudioFiles,
  iterateDirectory,
  requestPermission,
  scanDroppedItems,
  separateFileSystemEntries,
} from './util/fileSystem';

import type { ObservableInput } from 'rxjs';

async function deleteEntryEffect({
  path,
  deleteRequestedEntry,
}: State): Promise<Action<any> | undefined> {
  if (
    !path[path.length - 1] ||
    (await requestPermission(path[path.length - 1], 'readwrite'))
  ) {
    return;
  }

  await deleteEntry(path[path.length - 1], deleteRequestedEntry);
  return { type: ExplorerActionType.DELETE_ENTRY_DONE };
}

async function openFolderEffect(
  { path }: State,
  payload: FileSystemDirectoryHandle,
): Promise<Action<any> | undefined> {
  const { folders, files } = separateFileSystemEntries(
    await iterateDirectory(payload),
  );

  return {
    type: ExplorerActionType.MERGE_STATE,
    payload: {
      path: [...path, payload],
      files: filterAudioFiles(files),
      folders,
    },
  };
}

async function navigateUpEffect({ path, rootFolders, rootFiles }: State) {
  const newPath = path.slice(0, path.length - 1);
  const { folders, files } =
    newPath.length === 0
      ? { folders: rootFolders, files: rootFiles }
      : separateFileSystemEntries(
          await iterateDirectory(newPath[newPath.length - 1]),
        );

  return {
    type: ExplorerActionType.MERGE_STATE,
    payload: {
      path: newPath,
      files: filterAudioFiles(files),
      folders,
    },
  };
}

async function dropFileSystemEntryEffect(
  { files, folders }: State,
  { box, items }: { box: string; items: FileSystemHandle[] },
) {
  if (box === 'new') {
    const { files: filesNew, folders: foldersNew } =
      separateFileSystemEntries(items);

    return {
      type: ExplorerActionType.MERGE_STATE,
      payload: {
        rootFiles: filterAudioFiles(filesNew),
        rootFolders: foldersNew,
        files: filterAudioFiles(filesNew),
        folders: foldersNew,
      },
    };
  } else if (box === 'existing') {
    const { files: filesNew, folders: foldersNew } =
      separateFileSystemEntries(items);

    return {
      type: ExplorerActionType.MERGE_STATE,
      payload: {
        files: [...files, ...filterAudioFiles(filesNew)],
        folders: [...folders, ...foldersNew],
      },
    };
  } else if (box === 'scan') {
    const collections = await scanDroppedItems(items);
    await db.collections.bulkPut(collections);
  }
}

async function openCollectionEffect({ openCollectionName }: State) {
  const obj = await db.collections.get(openCollectionName);

  if (obj) {
    const { files, folders, hidden = {} } = obj;

    return {
      type: ExplorerActionType.MERGE_STATE,
      payload: {
        rootFiles: filterAudioFiles(files),
        rootFolders: folders,
        files: filterAudioFiles(files),
        folders,
        hidden,
      },
    };
  }

  return {
    type: ExplorerActionType.MERGE_STATE,
    payload: {
      openDialogOpen: false,
      saveCollectionName: openCollectionName,
    },
  };
}

async function saveCollectionEffect({
  saveCollectionName,
  folders,
  files,
  hidden,
}: State) {
  await db.collections.put(
    {
      name: saveCollectionName,
      folders,
      files,
      hidden,
      ordered: {},
      metadata: [],
    },
    saveCollectionName,
  );

  return {
    type: ExplorerActionType.MERGE_STATE,
    payload: {
      saveCollectionName,
      saveDialogOpen: false,
    },
  };
}

const effectsMap: {
  [key in ActionType]?: (state: State, payload: any) => ObservableInput<any>;
} = {
  [ExplorerActionType.DELETE_ENTRY]: deleteEntryEffect,
  [ExplorerActionType.OPEN_FOLDER]: openFolderEffect,
  [ExplorerActionType.NAVIGATE_UP]: navigateUpEffect,
  [ExplorerActionType.DROP_FILE_SYSTEM_ENTRY]: dropFileSystemEntryEffect,
  [ExplorerActionType.OPEN_COLLECTION]: openCollectionEffect,
  [ExplorerActionType.SAVE_COLLECTION]: saveCollectionEffect,
};

export default effectsMap;
