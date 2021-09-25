import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { db } from './util/persistence';

import Explorer from './components/Explorer';
import Player from './components/Player';
import SaveCollectionDialog from './components/modals/SaveCollectionDialog';
import OpenCollectionDialog from './components/modals/OpenCollectionDialog';
import DeleteFSEntryDialog from './components/modals/DeleteFSEntryDialog';

import './App.css';
import History from './components/History';
import { actions, state$ } from './stateManager';
import type { State } from './initialState';
import initialState from './initialState';

interface AppProps {}

function App({}: AppProps) {
  const [state, setState] = useState<State>(initialState);

  useEffect(() => {
    const subscription = state$.subscribe(setState);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(
    () =>
      actions.handlePathChange(state.path[state.path.length - 1]?.name || ''),
    [state.path],
  );

  const collectionNames = useLiveQuery(() =>
    db.collections.toCollection().toArray(),
  );

  return (
    <div className="w-full h-full font-semibold">
      <SaveCollectionDialog
        isOpen={state.saveDialogOpen}
        collectionName={state.saveCollectionName}
        onCollectionNameChange={actions.changeSaveCollectionName}
        onSave={actions.saveCollection}
        onCancel={actions.cancelSaveCollection}
      />

      <OpenCollectionDialog
        collectionNames={
          (collectionNames && collectionNames.map((c) => c.name)) || []
        }
        isOpen={state.openDialogOpen}
        collectionName={state.openCollectionName}
        onCollectionNameChange={actions.changeOpenCollectionName}
        onOpen={actions.openCollection}
        onCancel={actions.cancelOpenCollection}
      />

      <DeleteFSEntryDialog
        entryName={state.deleteRequestedEntry?.name || ''}
        isOpen={Boolean(state.deleteRequestedEntry)}
        isFolder={state.deleteRequestedEntry?.kind === 'directory'}
        onDelete={actions.deleteEntry}
        onCancel={actions.cancelDeleteEntry}
      />

      <Player
        activeFile={state.activeFile}
        collection={state.openCollectionName}
        path={state.path.map((f) => f.name).join('/')}
        onEnded={actions.handleTrackEnd}
        onNext={actions.next}
        onPrevious={actions.previous}
        onHistoricalEvent={db.history.add.bind(db.history)}
      />

      <Explorer
        activeFile={state.activeFile}
        onFolderOpen={actions.openFolder}
        onFileOpen={actions.openFile}
        onEntryHide={actions.hideEntry}
        onEntryDelete={actions.deleteEntry}
        onNavigateUp={actions.navigateUp}
        onNavigateHome={actions.navigateHome}
        files={state.files}
        folders={state.folders}
        hidden={
          state.hidden[state.path.map((f) => f.name).join('/') || '_'] || []
        }
        onFileFolderDrop={actions.dropFileSystemEntry}
        onCollectionSave={actions.requestSaveCollection}
        onCollectionOpen={actions.requestOpenCollection}
      />

      <History />
    </div>
  );
}

export default App;
