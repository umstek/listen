import React, { Fragment } from 'react';

import { Popover, Transition } from '@headlessui/react';
import {
  MdAdd as AddIcon,
  MdPlaylistAdd as PlaylistAddIcon,
  MdLibraryAdd as LibraryAddIcon,
} from 'react-icons/md';

import { getFile, getFolder } from '../../../util/fileSystem';

const solutions = [
  {
    name: 'New playlist',
    description: 'Create a new playlist and add to it',
    action: () => getFile('new'),
    icon: AddIcon,
  },
  {
    name: 'Add to playlist',
    description: 'Add to current playlist',
    action: () => getFile('existing'),
    icon: PlaylistAddIcon,
  },
  {
    name: 'Scan',
    description: 'Scan folder and make playlists automatically',
    action: getFolder,
    icon: LibraryAddIcon,
  },
];

export function AddItemsDropdown({
  onItemsSelected,
}: {
  onItemsSelected: ({
    box,
    items,
  }: {
    box: string;
    items: FileSystemHandle[];
  }) => void;
}) {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button className="p-2 rounded-full pushable secondary">
            <LibraryAddIcon
              className="h-6 w-6 fill-current"
              aria-hidden="true"
            />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform left-1/2 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                  {solutions.map((item) => (
                    <button
                      key={item.name}
                      onClick={async () => onItemsSelected(await item.action())}
                      className="cursor-pointer select-none flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 fill-current sm:h-12 sm:w-12">
                        <item.icon
                          className="h-6 w-6 fill-current"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-4 text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
