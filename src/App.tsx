import React, { useEffect, useState } from 'react';

import Explorer from './components/Explorer';
import Player from './components/Player';
import { iterateDirectory } from './util';
import { db } from './util/persistence';

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
        onCollectionSave={async () =>
          await db.collections.put({ name: 'test1', files, folders }, 'test1')
        }
        onCollectionOpen={async () => {
          const obj = await db.collections.get('test1');
          if (obj) {
            const { files, folders } = obj;
            setRootFiles(files);
            setRootFolders(folders);
            setFiles(files);
            setFolders(folders);
          }
        }}
      />
    </div>
  );
}

export default App;
