import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { db } from './util/persistence';
import { iterateDirectory } from './util';
import Explorer from './components/Explorer';
import Player from './components/Player';
import SaveCollectionDialog from './components/modals/SaveCollectionDialog';
import OpenCollectionDialog from './components/modals/OpenCollectionDialog';

import './App.css';

interface IAppProps {}

function App({}: IAppProps) {
  const [rootFiles, setRootFiles] = useState([] as any[]);
  const [rootFolders, setRootFolders] = useState([] as any[]);
  const [files, setFiles] = useState([] as any[]);
  const [folders, setFolders] = useState([] as any[]);
  const [path, setPath] = useState([] as any);
  const [activeFile, setActiveFile] = useState(-1);
  const [audioSource, setAudioSource] = useState<string | undefined>(undefined);

  const [isSaveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveCollectionName, setSaveCollectionName] = useState('');
  useEffect(() => {
    setSaveCollectionName(path[path.length - 1]?.name || '');
  }, [path]);

  const collectionNames = useLiveQuery(() =>
    db.collections.toCollection().toArray(),
  );
  const [isOpenDialogOpen, setOpenDialogOpen] = useState(false);
  const [openCollectionName, setOpenCollectionName] = useState('');

  useEffect(() => {
    if (activeFile < 0) {
      return;
    }

    const f = async () => {
      const fileHandle = files[activeFile];
      if (
        (await fileHandle.queryPermission({ mode: 'read' })) !== 'granted' &&
        (await fileHandle.requestPermission({ mode: 'read' })) !== 'granted'
      ) {
        return;
      }

      const fileData: File = await fileHandle.getFile();
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
        isOpen={isSaveDialogOpen}
        collectionName={saveCollectionName}
        onCollectionNameChange={setSaveCollectionName}
        onSave={async () => {
          await db.collections.put(
            { name: saveCollectionName, folders, files },
            saveCollectionName,
          );
          setSaveDialogOpen(false);
        }}
        onCancel={() => setSaveDialogOpen(false)}
      />

      <OpenCollectionDialog
        collectionNames={
          (collectionNames && collectionNames.map((c) => c.name)) || []
        }
        isOpen={isOpenDialogOpen}
        collectionName={openCollectionName}
        onCollectionNameChange={setOpenCollectionName}
        onOpen={async () => {
          const obj = await db.collections.get(openCollectionName);
          if (obj) {
            const { files, folders } = obj;
            setRootFiles(files);
            setRootFolders(folders);
            setFiles(files);
            setFolders(folders);
          }
          setOpenDialogOpen(false);
        }}
        onCancel={() => setOpenDialogOpen(false)}
      />

      <Player
        src={audioSource}
        onEnded={() => setActiveFile((activeFile + 1) % files.length)}
        onNext={() => setActiveFile((activeFile + 1) % files.length)}
        onPrevious={() =>
          setActiveFile((activeFile - 1 + files.length) % files.length)
        }
      />

      <Explorer
        activeFile={activeFile}
        onFolderOpen={async (folderHandle) => {
          setPath([...path, folderHandle]);
          const { directories, files } = await iterateDirectory(folderHandle);

          setFiles(files);
          setFolders(directories);
        }}
        onFileOpen={(fileHandle, i) => {
          setActiveFile(i);
        }}
        onNavigateUp={async () => {
          const backPath = [...path];
          backPath.pop();
          setPath(backPath);
          if (backPath.length === 0) {
            setFiles(rootFiles);
            setFolders(rootFolders);
          } else {
            const { directories, files } = await iterateDirectory(
              backPath[backPath.length - 1],
            );
            setFiles(files);
            setFolders(directories);
          }
        }}
        onNavigateHome={async () => {
          setPath([]);
          setFiles(rootFiles);
          setFolders(rootFolders);
        }}
        files={files}
        folders={folders}
        onFileFolderDrop={(files, folders) => {
          setRootFiles(files);
          setRootFolders(folders);
          setFiles(files);
          setFolders(folders);
        }}
        onCollectionSave={() => setSaveDialogOpen(true)}
        onCollectionOpen={() => setOpenDialogOpen(true)}
      />
    </div>
  );
}

export default App;
