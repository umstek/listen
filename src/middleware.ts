import { Action, ActionType, ExplorerActionType } from './actionTypes';
import type { State } from './initialState';
import {
  deleteEntry,
  filterAudioFiles,
  iterateDirectory,
  requestPermission,
  scanDroppedItems,
  separateFileSystemEntries,
} from './util/fileSystem';

import { db } from './util/persistence';

export const wrapDispatchWithMiddleware =
  (state: State, dispatch: React.Dispatch<Action<any>>) =>
  (type: ActionType) =>
  async <T>(payload?: T) => {
    const {
      path,
      deleteRequestedEntry,
      rootFolders,
      rootFiles,
      files,
      folders,
      openCollectionName,
      saveCollectionName,
      hidden,
    } = state;

    switch (type) {
      case ExplorerActionType.DELETE_ENTRY: {
        if (
          !path[path.length - 1] ||
          (await requestPermission(path[path.length - 1], 'readwrite'))
        ) {
          break;
        }

        await deleteEntry(path[path.length - 1], deleteRequestedEntry);
        dispatch({ type: ExplorerActionType.DELETE_ENTRY_DONE });

        break;
      }
      case ExplorerActionType.OPEN_FOLDER: {
        const { folders, files } = separateFileSystemEntries(
          await iterateDirectory(
            payload as unknown as FileSystemDirectoryHandle,
          ),
        );

        dispatch({
          type: ExplorerActionType.MERGE_STATE,
          payload: {
            path: [...path, payload],
            files: filterAudioFiles(files),
            folders,
          },
        });

        break;
      }
      case ExplorerActionType.NAVIGATE_UP: {
        const newPath = path.slice(0, path.length - 1);
        const { folders, files } =
          newPath.length === 0
            ? { folders: rootFolders, files: rootFiles }
            : separateFileSystemEntries(
                await iterateDirectory(newPath[newPath.length - 1]),
              );

        dispatch({
          type: ExplorerActionType.MERGE_STATE,
          payload: {
            path: newPath,
            files: filterAudioFiles(files),
            folders,
          },
        });

        break;
      }
      case ExplorerActionType.DROP_FILE_SYSTEM_ENTRY: {
        const { box, items } = payload as unknown as {
          box: string;
          items: FileSystemHandle[];
        };

        if (box === 'new') {
          const { files: filesNew, folders: foldersNew } =
            separateFileSystemEntries(items);

          dispatch({
            type: ExplorerActionType.MERGE_STATE,
            payload: {
              rootFiles: filterAudioFiles(filesNew),
              rootFolders: foldersNew,
              files: filterAudioFiles(filesNew),
              folders: foldersNew,
            },
          });
        } else if (box === 'existing') {
          const { files: filesNew, folders: foldersNew } =
            separateFileSystemEntries(items);

          dispatch({
            type: ExplorerActionType.MERGE_STATE,
            payload: {
              files: [...files, ...filterAudioFiles(filesNew)],
              folders: [...folders, ...foldersNew],
            },
          });
        } else if (box === 'scan') {
          const collections = await scanDroppedItems(items);
          await db.collections.bulkPut(collections);
        }

        break;
      }
      case ExplorerActionType.OPEN_COLLECTION: {
        const obj = await db.collections.get(openCollectionName);

        if (obj) {
          const { files, folders, hidden = {} } = obj;

          dispatch({
            type: ExplorerActionType.MERGE_STATE,
            payload: {
              rootFiles: filterAudioFiles(files),
              rootFolders: folders,
              files: filterAudioFiles(files),
              folders,
              hidden,
            },
          });
        }

        dispatch({
          type: ExplorerActionType.MERGE_STATE,
          payload: {
            openDialogOpen: false,
            saveCollectionName: openCollectionName,
          },
        });

        break;
      }
      case ExplorerActionType.SAVE_COLLECTION: {
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

        dispatch({
          type: ExplorerActionType.MERGE_STATE,
          payload: {
            saveCollectionName,
            saveDialogOpen: false,
          },
        });
      }
      default:
        break;
    }
  };
