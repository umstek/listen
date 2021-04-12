import React, { useState } from 'react';

import { file, folder, home, up } from './icons';
import { getFileSystemEntries, iterateDirectory } from './util';

interface IExplorerProps {
  onFileOpen: (path: string) => void;
}

const Explorer = ({ onFileOpen }: IExplorerProps) => {
  const [rootFiles, setRootFiles] = useState([] as any[]);
  const [rootDirectories, setRootDirectories] = useState([] as any[]);
  const [path, setPath] = useState([] as any);
  const [files, setFiles] = useState([] as any[]);
  const [directories, setDirectories] = useState([] as any[]);

  const handleDrop: React.DragEventHandler<HTMLDivElement> = async (ev) => {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      const { directories, files } = await getFileSystemEntries(
        ev.dataTransfer.items,
      );

      setRootFiles(files);
      setRootDirectories(directories);
      setFiles(files);
      setDirectories(directories);
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log('files:', ev.dataTransfer.files[i]);
      }
    }
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (ev) => {
    // console.log(ev);

    ev.preventDefault();
  };

  return (
    <div
      id="explorer"
      className="flex flex-col"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <button
        onClick={async () => {
          setPath([]);
          setFiles(rootFiles);
          setDirectories(rootDirectories);
        }}
      >
        {home}
        Home
      </button>
      <button
        onClick={async () => {
          const backPath = [...path];
          backPath.pop();
          setPath(backPath);
          if (backPath.length === 0) {
            setFiles(rootFiles);
            setDirectories(rootDirectories);
          } else {
            const { directories, files } = await iterateDirectory(
              backPath[backPath.length - 1],
            );
            setFiles(files);
            setDirectories(directories);
          }
        }}
      >
        {up}
        Up
      </button>
      {directories.map((x) => (
        <div key={x.name} className="flex flex-row">
          <button
            onClick={async () => {
              setPath([...path, x]);
              const { directories, files } = await iterateDirectory(x);

              setFiles(files);
              setDirectories(directories);
            }}
          >
            {folder}
          </button>

          {x.name}
        </div>
      ))}
      {files.map((x) => (
        <div
          key={x.name}
          className="hover:bg-blue-100 flex flex-row content-center"
        >
          <button
            onClick={async () => {
              const fileData: File = await x.getFile();
              const source = URL.createObjectURL(fileData);
              onFileOpen(source);
            }}
          >
            {file}
          </button>
          <div>{x.name}</div>
        </div>
      ))}
    </div>
  );
};

export default Explorer;
