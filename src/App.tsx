import { useEffect, useState } from 'react';

import { collections } from '~util/persistence';

import Explorer from '::Explorer';
import Player from '::Player';
import History from '::History';
import SaveCollectionDialog from '::modals/SaveCollectionDialog';
import OpenCollectionDialog from '::modals/OpenCollectionDialog';
import DeleteFSEntryDialog from '::modals/DeleteFSEntryDialog';

import './App.css';
import { actions, state$ } from './stateManager';
import type { State } from './initialState';
import initialState from './initialState';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AppProps {}

// eslint-disable-next-line no-empty-pattern
function App({}: AppProps) {
  const [state, setState] = useState<State>(initialState);
  const [playlists, setPlaylists] = useState<any>(null);

  useEffect(() => {
    const subscription = state$.subscribe(setState);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(
    () =>
      actions.handlePathChange(state.path[state.path.length - 1]?.name || ''),
    [state.path],
  );

  useEffect(() => {
    const subscription = collections.playlist.$.subscribe(setPlaylists);
    return () => subscription.unsubscribe();
  });

  return (
    <div className="w-full h-full font-semibold">
      {state.saveDialogOpen && (
        <SaveCollectionDialog
          isOpen={state.saveDialogOpen}
          collectionName={state.saveCollectionName}
          onCollectionNameChange={actions.changeSaveCollectionName}
          onSave={actions.saveCollection}
          onCancel={actions.cancelSaveCollection}
        />
      )}

      {state.openDialogOpen && (
        <OpenCollectionDialog
          collectionNames={playlists?.map((playlist: any) => playlist) || []}
          isOpen={state.openDialogOpen}
          collectionName={state.openCollectionName}
          onCollectionNameChange={actions.changeOpenCollectionName}
          onOpen={actions.openCollection}
          onCancel={actions.cancelOpenCollection}
        />
      )}

      {Boolean(state.deleteRequestedEntry) && (
        <DeleteFSEntryDialog
          entryName={state.deleteRequestedEntry?.name || ''}
          isOpen={Boolean(state.deleteRequestedEntry)}
          isFolder={state.deleteRequestedEntry?.kind === 'directory'}
          onDelete={actions.deleteEntry}
          onCancel={actions.cancelDeleteEntry}
        />
      )}

      <Player
        activeFile={state.activeFile}
        collection={state.openCollectionName}
        path={state.path.map((f) => f.name).join('/')}
        onEnded={actions.handleTrackEnd}
        onNext={actions.next}
        onPrevious={actions.previous}
        onHistoricalEvent={collections.historyRecord.insert.bind(history)}
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
