import React, { useRef } from 'react';

import {
  backward,
  next,
  pause,
  play,
  previous,
  stop,
  forward,
  shuffle,
  order,
  repeatAll,
  repeatOne,
} from './icons';

import './styles.css';

export enum PlayStatus {
  PLAYING,
  PAUSED,
  STOPPED,
}

export enum PlayMode {
  IN_ORDER,
  REPEAT_ONE,
  REPEAT_ALL,
  SHUFFLE,
}

interface IPlayButtonProps {
  status: PlayStatus;
}

const PlayButton = ({ status }: IPlayButtonProps) => {
  return (
    <button className="flex flex-row items-center h-16 w-16 bg-purple-500 control">
      <span className="mx-auto">
        {status === PlayStatus.PLAYING ? pause : play}
      </span>
    </button>
  );
};

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

interface IPlayerControlsProps {
  playStatus: PlayStatus;
  playMode: PlayMode;
}

const PlayerControls = ({ playStatus, playMode }: IPlayerControlsProps) => {
  const ref = useRef(null);

  return (
    <div ref={ref} className="flex flex-row justify-center items-center">
      <div className="flex flex-row justify-center items-center transition-all hover:bg-purple-50 bg-purple-100 rounded-full p-2">
        <button className="control">{previous}</button>
        <div className="flex flex-col items-center">
          <div className="flex flex-row justify-between">
            <button className="control m-1">{backward}</button>
            <button className="control m-1">{forward}</button>
          </div>
          <PlayButton status={playStatus} />
          <div className="flex flex-row justify-center mt-2">
            <button className="control">{stop}</button>
          </div>
        </div>
        <button className="control">{next}</button>

        {/* <ModeButton mode={playMode} /> */}
      </div>
    </div>
  );
};

export default PlayerControls;
