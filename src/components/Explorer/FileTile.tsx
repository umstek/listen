import React from 'react';

import { erase, fileIcon, folderIcon, hide } from './icons';

export interface IFileTileProps {
  file: any;
  isActiveFile?: boolean;
  onOpen: (file: any) => void;
  onHide: (file: any) => void;
  onDelete: (file: any) => void;
}

export const FileTile = ({
  file,
  isActiveFile,
  onOpen: handleOpen,
  onHide: handleHide,
  onDelete: handleDelete,
}: IFileTileProps) => (
  <div
    key={file.name}
    className={[
      `transition-all group`,
      `hover:bg-gray-100 hover:text-gray-900 flex flex-row items-center justify-between rounded-lg p-3 m-1`,
      isActiveFile && 'primary shadow-md',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <div className="flex flex-row cursor-default items-center">
      <button
        className="pushable outline-none rounded-full p-1"
        onClick={() => handleOpen(file)}
      >
        {file.kind === 'directory' ? folderIcon : fileIcon}
      </button>
      <div className="mx-2">{file.name}</div>
    </div>
    <div className="flex flex-row invisible group-hover:visible items-center">
      <button
        className="pushable outline-none rounded-full p-1 ml-2"
        onClick={() => handleHide(file)}
      >
        {hide}
      </button>
      <button
        className="pushable outline-none rounded-full p-1 ml-2 text-red-600"
        onClick={() => handleDelete(file)}
      >
        {erase}
      </button>
    </div>
  </div>
);
