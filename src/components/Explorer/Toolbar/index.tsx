import React from 'react';
import { AddItemsDropdown } from './AddItemsDropdown';
import { home, open, save, up } from './icons';

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
    <div className="flex flex-row">
      <button onClick={handleNavigateHome}>{home}</button>
      <button onClick={handleNavigateUp}>{up}</button>
      <button onClick={handleSave}>{save}</button>
      <button onClick={handleOpen}>{open}</button>
      <AddItemsDropdown onItemsSelected={handleAddItems}></AddItemsDropdown>
    </div>
  );
}
