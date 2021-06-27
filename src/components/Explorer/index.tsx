import React, { useState } from 'react';

import { getFileSystemEntries } from '../../util/fileSystem';
import { DropZone } from './DropZone';
import FileTile, { DropDown as FileTileDropDown } from './FileTile';
import { Toolbar } from './Toolbar';

interface IExplorerProps {
  files: FileSystemFileHandle[];
  folders: FileSystemDirectoryHandle[];
  hidden: string[];
  activeFile?: FileSystemFileHandle;
  onFileOpen: (file: any) => void;
  onFolderOpen: (folder: any) => void;
  onEntryHide: (entry: any) => void;
  onEntryDelete: (entry: any) => void;
  onNavigateUp: () => void;
  onNavigateHome: () => void;
  onFileFolderDrop: (box: string, items: FileSystemHandle[]) => void;
  onCollectionOpen: () => void;
  onCollectionSave: () => void;
}

const Explorer = ({
  files,
  folders,
  hidden,
  activeFile,
  onFileOpen: handleFileOpen,
  onFolderOpen: handleFolderOpen,
  onEntryHide: handleEntryHide,
  onEntryDelete: handleEntryDelete,
  onNavigateHome: handleNavigateHome,
  onNavigateUp: handleNavigateUp,
  onFileFolderDrop: handleFileFolderDrop,
  onCollectionOpen: handleOpen,
  onCollectionSave: handleSave,
}: IExplorerProps) => {
  const [isDropZoneVisible, setDropZoneVisible] = useState(false);

  const handleDragEnter: React.DragEventHandler<HTMLDivElement> = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    ev.dataTransfer.dropEffect = 'none';
    console.log('ex>>', ev);
    setDropZoneVisible(true);
    return false;
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    ev.dataTransfer.dropEffect = 'none';
    console.log('ex>>', ev);
    setDropZoneVisible(true);
    return false;
  };

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    console.log('ex>>', ev);
    setDropZoneVisible(false);
    return false;
  };

  const createDropHandler =
    (box: string): React.DragEventHandler<HTMLDivElement> =>
    async (ev) => {
      if (ev.dataTransfer.items) {
        handleFileFolderDrop(
          box,
          await getFileSystemEntries(ev.dataTransfer.items),
        );
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
          console.log('files:', ev.dataTransfer.files[i]);
        }
      }
    };

  return (
    <div
      id="explorer"
      className="flex flex-col h-full"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
    >
      <Toolbar
        onNavigateHome={handleNavigateHome}
        onNavigateUp={handleNavigateUp}
        onOpen={handleOpen}
        onSave={handleSave}
      />

      {isDropZoneVisible && (
        <DropZone
          onDropZoneVisibilityChange={setDropZoneVisible}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDropNew={createDropHandler('new')}
          onDropExisting={createDropHandler('existing')}
          onDropScan={createDropHandler('scan')}
        />
      )}

      {folders
        .filter((x) => !hidden.includes(x.name))
        .map((x) => (
          <FileTile key={x.name} file={x} onOpen={() => handleFolderOpen(x)}>
            <FileTileDropDown
              onHide={() => handleEntryHide(x)}
              onDelete={() => handleEntryDelete(x)}
            />
          </FileTile>
        ))}
      {files
        .filter((x) => !hidden.includes(x.name))
        .map((x) => (
          <FileTile
            key={x.name}
            file={x}
            isActiveFile={x === activeFile}
            onOpen={() => handleFileOpen(x)}
          >
            <FileTileDropDown
              onHide={() => handleEntryHide(x)}
              onDelete={() => handleEntryDelete(x)}
            />
          </FileTile>
        ))}
    </div>
  );
};

export default Explorer;
