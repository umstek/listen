import React, { useState } from 'react';

import './App.css';

async function getFileSystemEntries(items: DataTransferItemList) {
  const fileSystemEntries = await Promise.all(
    Object.keys(items)
      .map((i) => items[Number(i)])
      .filter((item) => item.kind === 'file') // file or folder, not a string
      .map((f) => f.getAsFileSystemHandle()),
  );
  const directories = fileSystemEntries.filter(
    (entry) => entry.kind === 'directory',
  );
  const files = fileSystemEntries.filter((entry) => entry.kind === 'file');

  return { directories, files };
}

interface AppProps {}

function App({}: AppProps) {
  const [files, setFiles] = useState([] as any[]);
  const [directories, setDirectories] = useState([] as any[]);
  const [audioSource, setAudioSource] = useState<string | undefined>(undefined);

  const handleDrop: React.DragEventHandler<HTMLDivElement> = async (ev) => {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      const { directories, files } = await getFileSystemEntries(
        ev.dataTransfer.items,
      );

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
    <div className="w-[640px] h-[480px]">
      <div
        className="w-1/2 h-1/2 bg-pink-300 rounded-md"
        id="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      ></div>
      <audio controls src={audioSource}></audio>
      <div id="explorer" className="flex flex-col">
        {directories.map((x) => (
          <div key={x.name} className="flex flex-row">
            <button>
              <svg
                className="inline-block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12.414 5H21a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2z" />
              </svg>
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
                setAudioSource(source);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M7.752 5.439l10.508 6.13a.5.5 0 0 1 0 .863l-10.508 6.13A.5.5 0 0 1 7 18.128V5.871a.5.5 0 0 1 .752-.432z" />
              </svg>
            </button>
            <div>{x.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
