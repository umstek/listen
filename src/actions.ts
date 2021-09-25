import type { Observer } from 'rxjs';

import { Action, ExplorerActionType, PlayerActionType } from './actionTypes';

export default function createActions(action$: Observer<Action<any>>) {
  return {
    handlePathChange: (path: string) =>
      action$.next({
        type: ExplorerActionType.PATH_CHANGE,
        payload: path,
      }),

    changeSaveCollectionName: (name: string) =>
      action$.next({
        type: ExplorerActionType.SAVE_COLLECTION_NAME_CHANGE,
        payload: name,
      }),
    saveCollection: () =>
      action$.next({
        type: ExplorerActionType.SAVE_COLLECTION,
      }),
    cancelSaveCollection: () =>
      action$.next({
        type: ExplorerActionType.CANCEL_SAVE_COLLECTION,
      }),

    changeOpenCollectionName: (name: string) =>
      action$.next({
        type: ExplorerActionType.OPEN_COLLECTION_NAME_CHANGE,
        payload: name,
      }),
    openCollection: () =>
      action$.next({
        type: ExplorerActionType.OPEN_COLLECTION,
      }),
    cancelOpenCollection: () =>
      action$.next({
        type: ExplorerActionType.CANCEL_OPEN_COLLECTION,
      }),

    deleteEntry: () =>
      action$.next({
        type: ExplorerActionType.DELETE_ENTRY,
      }),
    cancelDeleteEntry: () =>
      action$.next({
        type: ExplorerActionType.CANCEL_DELETE_ENTRY,
      }),

    handleTrackEnd: () =>
      action$.next({
        type: PlayerActionType.END_CURRENT,
      }),
    next: () =>
      action$.next({
        type: PlayerActionType.NEXT,
      }),
    previous: () =>
      action$.next({
        type: PlayerActionType.PREV,
      }),

    openFolder: (folder: any) =>
      action$.next({
        type: ExplorerActionType.OPEN_FOLDER,
        payload: folder,
      }),
    openFile: (file: any) =>
      action$.next({
        type: ExplorerActionType.OPEN_FILE,
        payload: file,
      }),
    hideEntry: (entry: any) =>
      action$.next({
        type: ExplorerActionType.HIDE_ENTRY,
        payload: entry,
      }),
    showEntry: (entry: any) =>
      action$.next({
        type: ExplorerActionType.SHOW_ENTRY,
        payload: entry,
      }),
    requestDeleteEntry: (entry: any) =>
      action$.next({
        type: ExplorerActionType.REQUEST_DELETE_ENTRY,
        payload: entry,
      }),
    navigateUp: () =>
      action$.next({
        type: ExplorerActionType.NAVIGATE_UP,
      }),
    navigateHome: () =>
      action$.next({
        type: ExplorerActionType.NAVIGATE_HOME,
      }),
    dropFileSystemEntry: (payload: {
      box: string;
      items: FileSystemHandle[];
    }) =>
      action$.next({
        type: ExplorerActionType.DROP_FILE_SYSTEM_ENTRY,
        payload,
      }),
    requestSaveCollection: () =>
      action$.next({
        type: ExplorerActionType.REQUEST_SAVE_COLLECTION,
      }),
    requestOpenCollection: () =>
      action$.next({
        type: ExplorerActionType.REQUEST_OPEN_COLLECTION,
      }),
  };
}
