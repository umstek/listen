import React, { ReactElement, useState } from 'react';

export interface IDropBoxProps {
  name: string;
  icon: ReactElement;
  description: string;
  onDrop: React.DragEventHandler<HTMLDivElement>;
}

export const DropBox = ({ name, icon, description, onDrop }: IDropBoxProps) => {
  const [mightDrop, setMightDrop] = useState(false);

  const handleDragEnter: React.DragEventHandler<HTMLDivElement> = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    setMightDrop(true);
    console.log('db>>', ev);
    return false;
  };

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    setMightDrop(false);
    console.log('db>>', ev);
    return false;
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (ev) => {
    console.log('db>>', ev);
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.dataTransfer.items || ev.dataTransfer.files.length > 0) {
      ev.dataTransfer.dropEffect = 'link';
      return false;
    } else {
      ev.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    setMightDrop(false);
    onDrop(ev);
    console.log('db>>', ev);
    return false;
  };

  return (
    <div
      className={[
        'bg-gradient-to-r from-pink-100 via-red-100 to-yellow-100 text-yellow-900 h-64 w-64',
        'transition-all rounded-xl ring-offset-2 ring-yellow-500 flex flex-col items-center justify-evenly transform',
        mightDrop && 'ring-2 scale-105 shadow-lg',
      ]
        .filter(Boolean)
        .join(' ')}
      id={`${name}-dropbox`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Hack to accept dropping into icon and paragraph elements */}
      <div className="bg-red-500 w-full h-full absolute opacity-0 rounded-xl"></div>
      {icon}
      <p>{description}</p>
    </div>
  );
};
