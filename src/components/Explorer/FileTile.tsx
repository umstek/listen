import React from 'react';
import { Menu } from '@headlessui/react';

import { erase, fileIcon, folderIcon, hide, more } from './icons';

interface DropDownProps {
  onHide: () => void;
  onDelete: () => void;
}

export const DropDown = ({
  onHide: handleHide,
  onDelete: handleDelete,
}: DropDownProps) => (
  <Menu as="div" className="relative inline-block text-left">
    <Menu.Button className="pushable outline-none rounded-full p-1 ml-2">
      {more}
    </Menu.Button>
    <Menu.Items className="absolute p-2 space-y-2 right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
      <Menu.Item>
        {({ active }) => (
          <button
            className={['menu-item', active && 'bg-gray-100']
              .filter(Boolean)
              .join(' ')}
            onClick={handleHide}
          >
            <span>{hide}</span>
            <span>Hide</span>
          </button>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <button
            className={[
              'menu-item',
              !active && 'text-red-600',
              active && 'danger',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={handleDelete}
          >
            <span>{erase}</span>
            <span>Erase</span>
          </button>
        )}
      </Menu.Item>
    </Menu.Items>
  </Menu>
);

interface FileTileProps {
  file: any;
  isActiveFile?: boolean;
  children: React.ReactElement<DropDownProps>;
  onOpen: () => void;
}

const FileTile = ({
  file,
  isActiveFile,
  children,
  onOpen: handleOpen,
}: FileTileProps) => (
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
        onClick={handleOpen}
      >
        {file.kind === 'directory' ? folderIcon : fileIcon}
      </button>
      <div className="mx-2">{file.name}</div>
    </div>
    <div className="flex flex-row invisible group-hover:visible items-center">
      {children}
    </div>
  </div>
);

export default FileTile;
