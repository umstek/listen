import React from 'react';
import type { IconType } from 'react-icons';

interface ToolButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  Icon: IconType;
}

export function ToolButton({ onClick: handleClick, Icon }: ToolButtonProps) {
  return (
    <button
      className="p-2 rounded-full pushable secondary"
      onClick={handleClick}
    >
      <Icon className="h-6 w-6 fill-current" />
    </button>
  );
}
