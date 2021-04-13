import React from 'react';

import { file, folder, home, up } from './icons';
import { getFileSystemEntries } from '../../util';

interface IExplorerProps {
  files: any[];
  folders: any[];
  activeFile: number;
  onFileOpen: (file: any, index: number) => void;
  onFolderOpen: (folder: any) => void;
  onNavigateUp: () => void;
  onNavigateHome: () => void;
  onFileFolderDrop: (files: any, folders: any) => void;
}

const Explorer = ({
  files,
  folders,
  activeFile,
  onFileOpen: handleFileOpen,
  onFolderOpen: handleFolderOpen,
  onNavigateHome: handleNavigateHome,
  onNavigateUp: handleNavigateUp,
  onFileFolderDrop: handleFileFolderDrop,
}: IExplorerProps) => {
  const handleDrop: React.DragEventHandler<HTMLDivElement> = async (ev) => {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      const { directories, files } = await getFileSystemEntries(
        ev.dataTransfer.items,
      );

      handleFileFolderDrop(files, directories);
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log('files:', ev.dataTransfer.files[i]);
      }
    }
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (ev) => {
    ev.dataTransfer.dropEffect = 'link';
    ev.preventDefault();
  };

  return (
    <div
      id="explorer"
      className="flex flex-col"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <button onClick={handleNavigateHome}>
        {home}
        Home
      </button>
      <button onClick={handleNavigateUp}>
        {up}
        Up
      </button>
      {folders.map((x) => (
        <div key={x.name} className="flex flex-row">
          <button onClick={() => handleFolderOpen(x)}>{folder}</button>
          {x.name}
        </div>
      ))}
      {files.map((x, i) => (
        <div
          key={x.name}
          className={[
            `hover:bg-purple-100 flex flex-row content-center rounded-md p-2 m-1`,
            i === activeFile &&
              'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <button onClick={() => handleFileOpen(x, i)}>{file}</button>
          <div>{x.name}</div>
        </div>
      ))}
    </div>
  );
};

export default Explorer;
