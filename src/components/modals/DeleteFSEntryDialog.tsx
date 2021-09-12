import React from 'react';
import { Dialog } from '@headlessui/react';

import BasicDialog from './BasicDialog';

interface IDeleteFSEntryDialogProps {
  isOpen: boolean;
  entryName: string;
  isFolder: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteFSEntryDialog = ({
  isOpen,
  entryName,
  isFolder,
  onDelete: handleDelete,
  onCancel: handleCancel,
}: IDeleteFSEntryDialogProps) => (
  <BasicDialog
    isOpen={isOpen}
    isDangerousAction
    onCancel={handleCancel}
    title={`Delete ${isFolder ? 'folder' : 'file'} ${entryName}?`}
    actions={[{ label: 'Delete', action: handleDelete }]}
  >
    <Dialog.Description className="text-sm text-gray-500 font-medium">
      Are you sure you want to <b>permanently</b> remove '{entryName}'
      {isFolder && <b> and its contents</b>} from your file system? (If you just
      want to omit file/folder from playing, use the 'hide' [eye] icon.)
    </Dialog.Description>
  </BasicDialog>
);

export default DeleteFSEntryDialog;
