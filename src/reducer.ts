import { Action, ExplorerActionType, PlayerActionType } from './actionTypes';
import type { State } from './initialState';
import { filterAudioFiles } from './util/fileSystem';

export default function reducer(state: State, action: Action<any>): State {
  const { files, hidden, path, activeFile, rootFiles, rootFolders } = state;

  switch (action.type) {
    case PlayerActionType.PREV: {
      if (!activeFile) {
        return { ...state, activeFile: files[files.length - 1] };
      }

      const hiddenItems =
        hidden[path.map((f) => f.name).join('/') || '_'] || [];
      const currentIndex = files.indexOf(activeFile);

      let prevIndex = (currentIndex - 1 + files.length) % files.length;
      while (
        hiddenItems.includes(files[prevIndex].name) &&
        currentIndex !== prevIndex
      ) {
        prevIndex = (prevIndex - 1 + files.length) % files.length;
      }
      return { ...state, activeFile: files[prevIndex] };
    }
    case PlayerActionType.NEXT:
    case PlayerActionType.END_CURRENT: {
      if (!activeFile) {
        return { ...state, activeFile: files[0] };
      }

      const hiddenItems =
        hidden[path.map((f) => f.name).join('/') || '_'] || [];
      const currentIndex = files.indexOf(activeFile);

      let nextIndex = (currentIndex + 1) % files.length;
      while (
        hiddenItems.includes(files[nextIndex].name) &&
        currentIndex !== nextIndex
      ) {
        nextIndex = (nextIndex + 1) % files.length;
      }
      return { ...state, activeFile: files[nextIndex] };
    }
    case ExplorerActionType.OPEN_FILE: {
      return { ...state, activeFile: action.payload };
    }
    case ExplorerActionType.HIDE_ENTRY: {
      const pathStr = path.map((f) => f.name).join('/') || '_';

      return {
        ...state,
        hidden: {
          ...hidden,
          [pathStr]: [
            ...new Set([...(hidden[pathStr] || []), action.payload?.name]),
          ],
        },
      };
    }
    case ExplorerActionType.NAVIGATE_HOME:
      return {
        ...state,
        path: [],
        files: filterAudioFiles(rootFiles),
        folders: rootFolders,
      };
    case ExplorerActionType.REQUEST_DELETE_ENTRY: // fallthrough
    case ExplorerActionType.CANCEL_DELETE_ENTRY: {
      return { ...state, deleteRequestedEntry: action.payload };
    }
    case ExplorerActionType.MERGE_STATE:
      return { ...state, ...action.payload };
    case ExplorerActionType.REQUEST_SAVE_COLLECTION:
      return { ...state, saveDialogOpen: true };
    case ExplorerActionType.REQUEST_OPEN_COLLECTION:
      return { ...state, openDialogOpen: true };
    case ExplorerActionType.CANCEL_SAVE_COLLECTION:
      return { ...state, saveDialogOpen: false };
    case ExplorerActionType.CANCEL_OPEN_COLLECTION:
      return { ...state, openDialogOpen: false };
    case ExplorerActionType.PATH_CHANGE:
      return { ...state, saveCollectionName: action.payload };
    case ExplorerActionType.SAVE_COLLECTION_NAME_CHANGE:
      return { ...state, saveCollectionName: action.payload };
    case ExplorerActionType.OPEN_COLLECTION_NAME_CHANGE:
      return { ...state, openCollectionName: action.payload };
    default:
      return state;
  }
}
