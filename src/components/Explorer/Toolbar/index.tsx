import React from 'react';
import { home, open, save, up } from './icons';

interface ToolbarProps {
  onNavigateHome: () => void;
  onNavigateUp: () => void;
  onSave: () => void;
  onOpen: () => void;
}

export function Toolbar({
  onNavigateHome: handleNavigateHome,
  onNavigateUp: handleNavigateUp,
  onSave: handleSave,
  onOpen: handleOpen,
}: ToolbarProps) {
  return (
    <div className="flex flex-row">
      <button onClick={handleNavigateHome}>{home}</button>
      <button onClick={handleNavigateUp}>{up}</button>
      <button onClick={handleSave}>{save}</button>
      <button onClick={handleOpen}>{open}</button>
    </div>
  );
}
