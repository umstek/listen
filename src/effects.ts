import type { ObservableInput } from 'rxjs';

import { Action, ExplorerActionType, type ActionType } from './actionTypes';
import type { State } from './initialState';
import {
  deleteEntry,
  filterAudioFiles,
  getDirectoryEntries,
  requestPermission,
  scanDroppedItems,
  separateFileSystemEntries,
} from '~util/fileSystem';
import * as playlists from '~util/database/playlists';

async function deleteEntryEffect({
  path,
  deleteRequestedEntry,
}: State): Promise<Action<any> | undefined> {
  if (
    !deleteEntryEffect ||
    !path[path.length - 1] ||
    (await requestPermission(path[path.length - 1], 'readwrite'))
  ) {
    return;
  }

  await deleteEntry(
    path[path.length - 1],
    deleteRequestedEntry as FileSystemHandle,
  );
  return { type: ExplorerActionType.DELETE_ENTRY_DONE };
}

async function openFolderEffect(
  { path }: State,
  payload: FileSystemDirectoryHandle,
): Promise<Action<any> | undefined> {
  const { folders, files } = separateFileSystemEntries(
    await getDirectoryEntries(payload),
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
          await getDirectoryEntries(newPath[newPath.length - 1]),
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
    await playlists.bulkInsert(collections);
  }
}

async function openPlaylistEffect({ openCollectionName }: State) {
  const obj = (
    await playlists.find({ selector: { name: openCollectionName }, limit: 1 })
  ).pop();

  // if (obj) {
  //   const { files, folders, hidden = {} } = obj;

  //   return {
  //     type: ExplorerActionType.MERGE_STATE,
  //     payload: {
  //       rootFiles: filterAudioFiles(files),
  //       rootFolders: folders,
  //       files: filterAudioFiles(files),
  //       folders,
  //       hidden,
  //     },
  //   };
  // }

  return {
    type: ExplorerActionType.MERGE_STATE,
    payload: {
      openDialogOpen: false,
      saveCollectionName: openCollectionName,
    },
  };
}

async function savePlaylistEffect({
  saveCollectionName,
  folders,
  files,
  hidden,
}: State) {
  // await playlists.insert({});

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
  [ExplorerActionType.OPEN_COLLECTION]: openPlaylistEffect,
  [ExplorerActionType.SAVE_COLLECTION]: savePlaylistEffect,
};

export default effectsMap;
