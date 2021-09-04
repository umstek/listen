import React, { useEffect, useState, useReducer } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { db } from './util/persistence';
import { requestPermission } from './util/fileSystem';
import { getMetadata } from './util/metadata';

import Explorer from './components/Explorer';
import Player from './components/Player';
import SaveCollectionDialog from './components/modals/SaveCollectionDialog';
import OpenCollectionDialog from './components/modals/OpenCollectionDialog';
import DeleteFSEntryDialog from './components/modals/DeleteFSEntryDialog';

import {
  ActionType,
  ExplorerActionType,
  PlayerActionType,
} from './actionTypes';
import { reducer } from './reducer';
import { initialState } from './initialState';
import { wrapDispatchWithMiddleware } from './middleware';

import './App.css';
import History from './components/History';

interface AppProps {}

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

  const handlePathChange = makeDispatch(ExplorerActionType.PATH_CHANGE);
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
    <div className="w-full h-full font-semibold">
      <SaveCollectionDialog
        isOpen={saveDialogOpen}
        collectionName={saveCollectionName}
        onCollectionNameChange={makeDispatch(
          ExplorerActionType.SAVE_COLLECTION_NAME_CHANGE,
        )}
        onSave={makeDispatchWithMiddleware(ExplorerActionType.SAVE_COLLECTION)}
        onCancel={makeDispatch(ExplorerActionType.CANCEL_SAVE_COLLECTION)}
      />

      <OpenCollectionDialog
        collectionNames={
          (collectionNames && collectionNames.map((c) => c.name)) || []
        }
        isOpen={openDialogOpen}
        collectionName={openCollectionName}
        onCollectionNameChange={makeDispatch(
          ExplorerActionType.OPEN_COLLECTION_NAME_CHANGE,
        )}
        onOpen={makeDispatchWithMiddleware(ExplorerActionType.OPEN_COLLECTION)}
        onCancel={makeDispatch(ExplorerActionType.CANCEL_OPEN_COLLECTION)}
      />

      <DeleteFSEntryDialog
        entryName={deleteRequestedEntry?.name || ''}
        isOpen={Boolean(deleteRequestedEntry)}
        isFolder={deleteRequestedEntry?.kind === 'directory'}
        onCancel={makeDispatch(ExplorerActionType.CANCEL_DELETE_ENTRY)}
        onDelete={makeDispatchWithMiddleware(ExplorerActionType.DELETE_ENTRY)}
      />

      <Player
        src={audioSource}
        onEnded={makeDispatch(PlayerActionType.END_CURRENT)}
        onNext={makeDispatch(PlayerActionType.NEXT)}
        onPrevious={makeDispatch(PlayerActionType.PREV)}
      />

      <Explorer
        activeFile={activeFile}
        onFolderOpen={makeDispatchWithMiddleware(
          ExplorerActionType.OPEN_FOLDER,
        )}
        onFileOpen={makeDispatch(ExplorerActionType.OPEN_FILE)}
        onEntryHide={makeDispatch(ExplorerActionType.HIDE_ENTRY)}
        onEntryDelete={makeDispatch(ExplorerActionType.REQUEST_DELETE_ENTRY)}
        onNavigateUp={makeDispatchWithMiddleware(
          ExplorerActionType.NAVIGATE_UP,
        )}
        onNavigateHome={makeDispatch(ExplorerActionType.NAVIGATE_HOME)}
        files={files}
        folders={folders}
        hidden={hidden[path.map((f) => f.name).join('/') || '_'] || []}
        onFileFolderDrop={makeDispatchWithMiddleware(
          ExplorerActionType.DROP_FILE_SYSTEM_ENTRY,
        )}
        onCollectionSave={makeDispatch(
          ExplorerActionType.REQUEST_SAVE_COLLECTION,
        )}
        onCollectionOpen={makeDispatch(
          ExplorerActionType.REQUEST_OPEN_COLLECTION,
        )}
      />

      <History />
    </div>
  );
}

export default App;
