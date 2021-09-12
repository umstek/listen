import React, { useState } from 'react';
import { Dialog, RadioGroup } from '@headlessui/react';

import BasicDialog from './BasicDialog';

interface IOpenCollectionDialogProps {
  collectionNames: string[];
  isOpen: boolean;
  collectionName: string;
  onCollectionNameChange: (name: string) => void;
  onOpen: () => void;
  onCancel: () => void;
}

const OpenCollectionDialog = ({
  collectionNames,
  isOpen,
  collectionName,
  onCollectionNameChange: handleCollectionNameChange,
  onOpen: handleOpen,
  onCancel: handleCancel,
}: IOpenCollectionDialogProps) => {
  const [search, setSearch] = useState('');

  return (
    <BasicDialog
      isOpen={isOpen}
      onCancel={handleCancel}
      title="Open a collection"
      actions={[{ label: 'Open', action: handleOpen }]}
    >
      <Dialog.Description className="text-sm text-gray-500 font-medium">
        Search for a collection to open
      </Dialog.Description>
      <input
        type="text"
        className="input px-3 py-2 my-2 rounded font-medium"
        value={search}
        onChange={(ev) => setSearch(ev.target.value)}
      />
      <RadioGroup
        value={collectionName}
        onChange={handleCollectionNameChange}
        className="space-y-2 my-2 h-[40vh] p-2 overflow-y-auto font-medium"
      >
        {collectionNames
          .filter((name) => name.toLowerCase().includes(search.toLowerCase()))
          .map((name) => (
            <RadioGroup.Option
              key={name}
              className="outline-none focus:outline-none focus:ring-offset-1 focus:ring-2 focus:ring-yellow-500 rounded-lg"
              value={name}
            >
              {({ checked }) => (
                <div
                  className={[
                    'py-2 px-3 rounded-lg cursor-pointer truncate select-none',
                    checked && 'primary shadow-md',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {name}
                </div>
              )}
            </RadioGroup.Option>
          ))}
      </RadioGroup>
    </BasicDialog>
  );
};

export default OpenCollectionDialog;
