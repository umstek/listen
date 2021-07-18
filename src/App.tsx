import React, { useEffect, useState, useReducer } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { db } from './util/persistence';
import {
  deleteEntry,
  filterAudioFiles,
  iterateDirectory,
  requestPermission,
  scanDroppedItems,
  separateFileSystemEntries,
} from './util/fileSystem';
import { getMetadata } from './util/metadata';
import Explorer from './components/Explorer';
import Player from './components/Player';
import SaveCollectionDialog from './components/modals/SaveCollectionDialog';
import OpenCollectionDialog from './components/modals/OpenCollectionDialog';
import DeleteFSEntryDialog from './components/modals/DeleteFSEntryDialog';

import './App.css';

interface AppProps {}

const initialState = {
  rootFolders: [] as FileSystemDirectoryHandle[],
  rootFiles: [] as FileSystemFileHandle[],
  folders: [] as FileSystemDirectoryHandle[],
  files: [] as FileSystemFileHandle[],
  path: [] as FileSystemDirectoryHandle[],
  activeFile: undefined as FileSystemFileHandle | undefined,
  hidden: {} as { [path: string]: string[] },
  deleteRequestedEntry: undefined as FileSystemHandle | undefined,
  openDialogOpen: false,
  openCollectionName: '',
  saveDialogOpen: false,
  saveCollectionName: '',
};

type ActionType =
  | 'prev'
  | 'next'
  | 'end-current'
  | 'open-folder'
  | 'open-file'
  | 'hide-file'
  | 'delete-entry-request'
  | 'cancel-delete-entry-request'
  | 'delete-entry'
  | 'delete-entry-done'
  | 'navigate-up'
  | 'navigate-home'
  | 'merge-state'
  | 'file-folder-drop'
  | 'save-collection-dialog'
  | 'open-collection-dialog'
  | 'save-collection-dialog-close'
  | 'open-collection-dialog-close'
  | 'open-collection'
  | 'save-collection'
  | 'open-collection-name-change'
  | 'save-collection-name-change'
  | 'path-change';

interface Action<T> {
  type: ActionType;
  payload?: T;
}

function reducer(
  state: typeof initialState,
  action: Action<any>,
): typeof initialState {
  const { files, hidden, path, activeFile, rootFiles, rootFolders } = state;

  switch (action.type) {
    case 'prev': {
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
    case 'next':
    case 'end-current': {
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
    case 'open-file': {
      return { ...state, activeFile: action.payload };
    }
    case 'hide-file': {
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
    case 'navigate-home':
      return {
        ...state,
        path: [],
        files: filterAudioFiles(rootFiles),
        folders: rootFolders,
      };
    case 'delete-entry-request':
    case 'cancel-delete-entry-request': {
      return { ...state, deleteRequestedEntry: action.payload };
    }
    case 'merge-state':
      return { ...state, ...action.payload };
    case 'save-collection-dialog':
      return { ...state, saveDialogOpen: true };
    case 'open-collection-dialog':
      return { ...state, openDialogOpen: true };
    case 'save-collection-dialog-close':
      return { ...state, saveDialogOpen: false };
    case 'open-collection-dialog-close':
      return { ...state, openDialogOpen: false };
    case 'path-change':
      return { ...state, saveCollectionName: action.payload };
    case 'save-collection-name-change':
      return { ...state, saveCollectionName: action.payload };
    case 'open-collection-name-change':
      return { ...state, openCollectionName: action.payload };
    default:
      return state;
  }
}

const wrapDispatchWithMiddleware =
  (state: typeof initialState, dispatch: React.Dispatch<Action<any>>) =>
  (type: ActionType) =>
  async <T,>(payload?: T) => {
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
      case 'delete-entry': {
        if (
          !path[path.length - 1] ||
          (await requestPermission(path[path.length - 1], 'readwrite'))
        ) {
          break;
        }

        await deleteEntry(path[path.length - 1], deleteRequestedEntry);
        dispatch({ type: 'delete-entry-done' });

        break;
      }
      case 'open-folder': {
        const { folders, files } = separateFileSystemEntries(
          await iterateDirectory(
            payload as unknown as FileSystemDirectoryHandle,
          ),
        );

        dispatch({
          type: 'merge-state',
          payload: {
            path: [...path, payload],
            files: filterAudioFiles(files),
            folders,
          },
        });

        break;
      }
      case 'navigate-up': {
        const newPath = path.slice(0, path.length - 1);
        const { folders, files } =
          newPath.length === 0
            ? { folders: rootFolders, files: rootFiles }
            : separateFileSystemEntries(
                await iterateDirectory(newPath[newPath.length - 1]),
              );

        dispatch({
          type: 'merge-state',
          payload: {
            path: newPath,
            files: filterAudioFiles(files),
            folders,
          },
        });

        break;
      }
      case 'file-folder-drop': {
        const { box, items } = payload as unknown as {
          box: string;
          items: FileSystemHandle[];
        };

        if (box === 'new') {
          const { files: filesNew, folders: foldersNew } =
            separateFileSystemEntries(items);

          dispatch({
            type: 'merge-state',
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
            type: 'merge-state',
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
      case 'open-collection': {
        const obj = await db.collections.get(openCollectionName);

        if (obj) {
          const { files, folders, hidden = {} } = obj;

          dispatch({
            type: 'merge-state',
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
          type: 'merge-state',
          payload: {
            openDialogOpen: false,
            saveCollectionName: openCollectionName,
          },
        });

        break;
      }
      case 'save-collection': {
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
          type: 'merge-state',
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

function App({}: AppProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    files,
    folders,
    hidden,
    path,
    activeFile,
    deleteRequestedEntry,
    saveDialogOpen,
    saveCollectionName,
    openDialogOpen,
    openCollectionName,
  } = state;

  const makeDispatch =
    (type: ActionType) =>
    <T,>(payload?: T) =>
      dispatch({ type, payload });

  const makeDispatchWithMiddleware = wrapDispatchWithMiddleware(
    state,
    dispatch,
  );

  const [audioSource, setAudioSource] = useState<string | undefined>(undefined);

  const handlePathChange = makeDispatch('path-change');
  useEffect(() => handlePathChange(path[path.length - 1]?.name || ''), [path]);

  const collectionNames = useLiveQuery(() =>
    db.collections.toCollection().toArray(),
  );

  useEffect(() => {
    if (activeFile === undefined) {
      return;
    }

    const f = async () => {
      if ((await requestPermission(activeFile, 'read')) !== 'granted') {
        return;
      }

      const fileData: File = await activeFile.getFile();
      const metadata = await getMetadata(fileData);
      console.log(metadata);
      const source = URL.createObjectURL(fileData);
      setAudioSource(source);
    };

    f();

    return () => {
      audioSource && URL.revokeObjectURL(audioSource);
    };
  }, [activeFile]);

  return (
    <div className="w-[640px] h-[480px]">
      <SaveCollectionDialog
        isOpen={saveDialogOpen}
        collectionName={saveCollectionName}
        onCollectionNameChange={makeDispatch('save-collection-name-change')}
        onSave={makeDispatchWithMiddleware('save-collection')}
        onCancel={makeDispatch('save-collection-dialog-close')}
      />

      <OpenCollectionDialog
        collectionNames={
          (collectionNames && collectionNames.map((c) => c.name)) || []
        }
        isOpen={openDialogOpen}
        collectionName={openCollectionName}
        onCollectionNameChange={makeDispatch('open-collection-name-change')}
        onOpen={makeDispatchWithMiddleware('open-collection')}
        onCancel={makeDispatch('open-collection-dialog-close')}
      />

      <DeleteFSEntryDialog
        entryName={deleteRequestedEntry?.name || ''}
        isOpen={Boolean(deleteRequestedEntry)}
        isFolder={deleteRequestedEntry?.kind === 'directory'}
        onCancel={makeDispatch('cancel-delete-entry-request')}
        onDelete={makeDispatchWithMiddleware('delete-entry')}
      />

      <Player
        src={audioSource}
        onEnded={makeDispatch('end-current')}
        onNext={makeDispatch('next')}
        onPrevious={makeDispatch('prev')}
      />

      <Explorer
        activeFile={activeFile}
        onFolderOpen={makeDispatchWithMiddleware('open-folder')}
        onFileOpen={makeDispatch('open-file')}
        onEntryHide={makeDispatch('hide-file')}
        onEntryDelete={makeDispatch('delete-entry-request')}
        onNavigateUp={makeDispatchWithMiddleware('navigate-up')}
        onNavigateHome={makeDispatch('navigate-home')}
        files={files}
        folders={folders}
        hidden={hidden[path.map((f) => f.name).join('/') || '_'] || []}
        onFileFolderDrop={makeDispatchWithMiddleware('file-folder-drop')}
        onCollectionSave={makeDispatch('save-collection-dialog')}
        onCollectionOpen={makeDispatch('open-collection-dialog')}
      />
    </div>
  );
}

export default App;
