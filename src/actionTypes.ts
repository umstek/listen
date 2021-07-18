export enum PlayerActionType {
  PREV = 'player/prev',
  NEXT = 'player/next',
  PAUSE = 'player/pause',
  PLAY = 'player/play',
  END_CURRENT = 'player/endCurrent',
  REWIND = 'player/rewind',
  FORWARD = 'player/forward',
  STOP = 'player/stop',
}

export enum PlaylistActionType {}

export enum ExplorerActionType {
  OPEN_FOLDER = 'explorer/openFolder',
  OPEN_FILE = 'explorer/openFile',
  PATH_CHANGE = 'explorer/pathChange',
  HIDE_ENTRY = 'explorer/hideEntry',
  REQUEST_DELETE_ENTRY = 'explorer/requestDeleteEntry',
  CANCEL_DELETE_ENTRY = 'explorer/cancelDeleteEntry',
  DELETE_ENTRY = 'explorer/deleteEntry',
  DELETE_ENTRY_DONE = 'explorer/deleteEntryDone',
  REQUEST_SAVE_COLLECTION = 'explorer/requestSaveCollection',
  CANCEL_SAVE_COLLECTION = 'explorer/cancelSaveCollection',
  SAVE_COLLECTION_NAME_CHANGE = 'explorer/saveCollectionNameChange',
  SAVE_COLLECTION = 'explorer/saveCollection',
  REQUEST_OPEN_COLLECTION = 'explorer/requestOpenCollection',
  CANCEL_OPEN_COLLECTION = 'explorer/cancelOpenCollection',
  OPEN_COLLECTION_NAME_CHANGE = 'explorer/openCollectionNameChange',
  OPEN_COLLECTION = 'explorer/openCollection',
  NAVIGATE_UP = 'explorer/navigateUp',
  NAVIGATE_HOME = 'explorer/navigateHome',
  DROP_FILE_SYSTEM_ENTRY = 'explorer/dropFileSystemEntry',
  MERGE_STATE = 'explorer/mergeState',
}

export type ActionType =
  | PlayerActionType
  | PlaylistActionType
  | ExplorerActionType;

export interface Action<T> {
  type: ActionType;
  payload?: T;
}
