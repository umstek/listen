import React, { useState } from 'react';

import { DropBox } from './DropBox';
import { getFileSystemEntries } from '../../util/fileSystem';
import {
  addToPlaylist,
  erase,
  file,
  folder,
  hide,
  home,
  newPlaylist,
  open,
  save,
  scan,
  up,
} from './icons';

interface IExplorerProps {
  files: any[];
  folders: any[];
  hidden: string[];
  activeFile: any;
  onFileOpen: (file: any, index: number) => void;
  onFolderOpen: (folder: any) => void;
  onEntryHide: (entry: any, index: number) => void;
  onEntryDelete: (entry: any, index: number) => void;
  onNavigateUp: () => void;
  onNavigateHome: () => void;
  onFileFolderDrop: (box: string, items: any[]) => void;
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

  const createDropHandler = (
    box: string,
  ): React.DragEventHandler<HTMLDivElement> => async (ev) => {
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
      <div className="flex flex-row">
        <button onClick={handleNavigateHome}>{home}</button>
        <button onClick={handleNavigateUp}>{up}</button>
        <button onClick={handleSave}>{save}</button>
        <button onClick={handleOpen}>{open}</button>
      </div>

      {isDropZoneVisible && (
        <div
          className="z-20 grid grid-cols-2 gap-8 p-8 absolute bg-white rounded-3xl shadow-2xl mx-auto transition-all"
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          <div
            className="absolute right-0 top-0 p-1 bg-white rounded-full"
            onClick={(ev) => setDropZoneVisible(false)}
          >
            <div className="rounded-full transition-all bg-red-100 text-red-600 hover:text-red-100 hover:bg-red-600">
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
              </svg>
            </div>
          </div>

          <DropBox
            name="new"
            icon={newPlaylist}
            description="Make a new playlist"
            onDrop={createDropHandler('new')}
          />

          <DropBox
            name="existing"
            icon={addToPlaylist}
            description="Add to current playlist"
            onDrop={createDropHandler('existing')}
          />

          <DropBox
            name="scan"
            icon={scan}
            description="Scan folder and make playlists automatically"
            onDrop={createDropHandler('scan')}
          />
        </div>
      )}

      {folders
        .filter((x) => !hidden.includes(x.name))
        .map((x, i) => (
          <div
            key={x.name}
            className={[
              `transition-all group`,
              `hover:bg-gray-100 hover:text-gray-900 flex flex-row items-center justify-between rounded-lg p-3 m-1`,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="flex flex-row cursor-default items-center">
              <button
                className="pushable outline-none rounded-full p-1"
                onClick={() => handleFolderOpen(x)}
              >
                {folder}
              </button>
              <div className="mx-2">{x.name}</div>
            </div>
            <div className="flex flex-row invisible group-hover:visible items-center">
              <button
                className="pushable outline-none rounded-full p-1 ml-2"
                onClick={() => handleEntryHide(x, i)}
              >
                {hide}
              </button>
              <button
                className="pushable outline-none rounded-full p-1 ml-2 text-red-600"
                onClick={() => handleEntryDelete(x, i)}
              >
                {erase}
              </button>
            </div>
          </div>
        ))}
      {files
        .filter((x) => !hidden.includes(x.name))
        .map((x, i) => (
          <div
            key={x.name}
            className={[
              `transition-all group`,
              `hover:bg-gray-100 hover:text-gray-900 flex flex-row items-center justify-between rounded-lg p-3 m-1`,
              x === activeFile && 'primary shadow-md',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="flex flex-row cursor-default items-center">
              <button
                className="pushable outline-none rounded-full p-1"
                onClick={() => handleFileOpen(x, i)}
              >
                {file}
              </button>
              <div className="mx-2">{x.name}</div>
            </div>
            <div className="flex flex-row invisible group-hover:visible items-center">
              <button
                className="pushable outline-none rounded-full p-1 ml-2"
                onClick={() => handleEntryHide(x, i)}
              >
                {hide}
              </button>
              <button
                className="pushable outline-none rounded-full p-1 ml-2 text-red-600"
                onClick={() => handleEntryDelete(x, i)}
              >
                {erase}
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Explorer;
