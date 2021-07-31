import React from 'react';
import { AddItemsDropdown } from './AddItemsDropdown';
import {
  MdHome as HomeIcon,
  MdArrowUpward as UpIcon,
  MdSave as SaveIcon,
  MdFolderOpen as OpenIcon,
} from 'react-icons/md';
import { ToolButton } from './ToolButton';

interface ToolbarProps {
  onNavigateHome: () => void;
  onNavigateUp: () => void;
  onSave: () => void;
  onOpen: () => void;
  onAddItems: ({
    box,
    items,
  }: {
    box: string;
    items: FileSystemHandle[];
  }) => void;
}

export function Toolbar({
  onNavigateHome: handleNavigateHome,
  onNavigateUp: handleNavigateUp,
  onSave: handleSave,
  onOpen: handleOpen,
  onAddItems: handleAddItems,
}: ToolbarProps) {
  return (
    <div className="p-4 flex flex-row space-x-2">
      <ToolButton Icon={HomeIcon} onClick={handleNavigateHome} />
      <ToolButton Icon={UpIcon} onClick={handleNavigateUp} />
      <ToolButton Icon={SaveIcon} onClick={handleSave} />
      <ToolButton Icon={OpenIcon} onClick={handleOpen} />
      <AddItemsDropdown onItemsSelected={handleAddItems} />
    </div>
  );
}
