import { order, shuffle, repeatOne, repeatAll } from './icons';

export enum PlayMode {
  IN_ORDER,
  REPEAT_ONE,
  REPEAT_ALL,
  SHUFFLE,
}

interface IModeButtonProps {
  mode: PlayMode;
}

const playModeToIconMap = {
  [PlayMode.IN_ORDER]: order,
  [PlayMode.SHUFFLE]: shuffle,
  [PlayMode.REPEAT_ONE]: repeatOne,
  [PlayMode.REPEAT_ALL]: repeatAll,
};

const ModeButton = ({ mode }: IModeButtonProps) => {
  return <button>{playModeToIconMap[mode] || order}</button>;
};
