import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { db } from './util/persistence';
import {
  filterAudioFiles,
  iterateDirectory,
  scanDroppedItems,
  separateFileSystemEntries,
} from './util/fileSystem';
import Explorer from './components/Explorer';
import Player from './components/Player';
import SaveCollectionDialog from './components/modals/SaveCollectionDialog';
import OpenCollectionDialog from './components/modals/OpenCollectionDialog';

import './App.css';

interface IAppProps {}

function App({}: IAppProps) {
  const [rootFiles, setRootFiles] = useState<any[]>([]);
  const [rootFolders, setRootFolders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [hidden, setHidden] = useState<{ [path: string]: string[] }>({});
  const [path, setPath] = useState<any[]>([]);
  const [activeFile, setActiveFile] = useState<any>(undefined);
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

  const handleNext = () => {
    const hiddenItems = hidden[path.map((f) => f.name).join('/') || '_'] || [];
    const currentIndex = files.indexOf(activeFile);

    let nextIndex = (currentIndex + 1) % files.length;
    while (
      hiddenItems.includes(files[nextIndex].name) &&
      currentIndex !== nextIndex
    ) {
      nextIndex = (nextIndex + 1) % files.length;
    }
    setActiveFile(files[nextIndex]);
  };

  const handlePrevious = () => {
    const hiddenItems = hidden[path.map((f) => f.name).join('/') || '_'] || [];
    const currentIndex = files.indexOf(activeFile);

    let prevIndex = (currentIndex - 1 + files.length) % files.length;
    while (
      hiddenItems.includes(files[prevIndex].name) &&
      currentIndex !== prevIndex
    ) {
      prevIndex = (prevIndex - 1 + files.length) % files.length;
    }
    setActiveFile(files[prevIndex]);
  };

  useEffect(() => {
    if (activeFile === undefined) {
      return;
    }

    const f = async () => {
      if (
        (await activeFile.queryPermission({ mode: 'read' })) !== 'granted' &&
        (await activeFile.requestPermission({ mode: 'read' })) !== 'granted'
      ) {
        return;
      }

      const fileData: File = await activeFile.getFile();
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
            { name: saveCollectionName, folders, files, hidden },
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
            const { files, folders, hidden } = obj;
            setRootFiles(files);
            setRootFolders(folders);
            setFiles(filterAudioFiles(files));
            setFolders(folders);
            setHidden(hidden || {});
          }
          setOpenDialogOpen(false);
          setSaveCollectionName(openCollectionName);
        }}
        onCancel={() => setOpenDialogOpen(false)}
      />

      <Player
        src={audioSource}
        onEnded={handleNext}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <Explorer
        activeFile={activeFile}
        onFolderOpen={async (folderHandle) => {
          setPath([...path, folderHandle]);
          const { folders, files } = separateFileSystemEntries(
            await iterateDirectory(folderHandle),
          );

          setFiles(filterAudioFiles(files));
          setFolders(folders);
        }}
        onFileOpen={(fileHandle) => {
          setActiveFile(fileHandle);
        }}
        onEntryHide={(entryHandle) => {
          const pathStr = path.map((f) => f.name).join('/') || '_';

          setHidden({
            ...hidden,
            [pathStr]: [
              ...new Set([...(hidden[pathStr] || []), entryHandle.name]),
            ],
          });
        }}
        onEntryDelete={(entryHandle, i) => {}}
        onNavigateUp={async () => {
          const backPath = [...path];
          backPath.pop();
          setPath(backPath);
          if (backPath.length === 0) {
            setFiles(filterAudioFiles(rootFiles));
            setFolders(rootFolders);
          } else {
            const { folders, files } = separateFileSystemEntries(
              await iterateDirectory(backPath[backPath.length - 1]),
            );
            setFiles(filterAudioFiles(files));
            setFolders(folders);
          }
        }}
        onNavigateHome={async () => {
          setPath([]);
          setFiles(filterAudioFiles(rootFiles));
          setFolders(rootFolders);
        }}
        files={files}
        folders={folders}
        hidden={hidden[path.map((f) => f.name).join('/') || '_'] || []}
        onFileFolderDrop={async (box, items) => {
          if (box === 'new') {
            const {
              files: filesNew,
              folders: foldersNew,
            } = separateFileSystemEntries(items);
            setRootFiles(filterAudioFiles(filesNew));
            setRootFolders(foldersNew);
            setFiles(filterAudioFiles(filesNew));
            setFolders(foldersNew);
          } else if (box === 'existing') {
            const {
              files: filesNew,
              folders: foldersNew,
            } = separateFileSystemEntries(items);
            setFiles([...files, ...filterAudioFiles(filesNew)]);
            setFolders([...folders, ...foldersNew]);
          } else if (box === 'scan') {
            const collections = await scanDroppedItems(items);
            await db.collections.bulkPut(collections);
          }
        }}
        onCollectionSave={() => setSaveDialogOpen(true)}
        onCollectionOpen={() => setOpenDialogOpen(true)}
      />
    </div>
  );
}

export default App;
