import React from 'react';
import { Dialog } from '@headlessui/react';

import BasicDialog from './BasicDialog';

interface ISaveCollectionDialogProps {
  isOpen: boolean;
  collectionName: string;
  onCollectionNameChange: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const SaveCollectionDialog = ({
  isOpen,
  collectionName,
  onCollectionNameChange: handleCollectionNameChange,
  onSave: handleSave,
  onCancel: handleCancel,
}: ISaveCollectionDialogProps) => (
  <BasicDialog
    isOpen={isOpen}
    onCancel={handleCancel}
    title="Save as a collection"
    actions={[{ label: 'Save', action: handleSave }]}
  >
    <Dialog.Description className="text-sm text-gray-500">
      Enter a name for your collection
    </Dialog.Description>
    <input
      type="text"
      className="input px-3 py-2 my-2 rounded"
      value={collectionName}
      onChange={(ev) => handleCollectionNameChange(ev.target.value)}
    />
  </BasicDialog>
);

export default SaveCollectionDialog;
