import React, { useEffect, useRef, useState } from 'react';

import { clamp } from '../../util/math';
import { backward, next, pause, play, previous, stop, forward } from './icons';

import './styles.css';

export enum PlayStatus {
  PLAYING,
  PAUSED,
  STOPPED,
}

interface IPlayButtonProps {
  status: PlayStatus;
  onClick: () => void;
}

const PlayButton = ({ status, onClick: handleClick }: IPlayButtonProps) => {
  return (
    <button
      className="flex flex-row items-center h-16 w-16 text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 control"
      onClick={handleClick}
    >
      <span className="mx-auto">
        {status === PlayStatus.PLAYING ? pause : play}
      </span>
    </button>
  );
};

interface IPlayerControlsProps {
  src?: string;
  autoplay?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onEnded: () => void;
}

const PlayerControls = ({
  src,
  autoplay = true,
  onPrevious: handlePrevious,
  onNext: handleNext,
  onEnded: handleEnded,
}: IPlayerControlsProps) => {
  const [position, setPosition] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [playStatus, setPlayStatus] = useState(PlayStatus.STOPPED);
  const audioElement = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    switch (playStatus) {
      case PlayStatus.PAUSED:
        audioElement.current?.pause();
        break;
      case PlayStatus.STOPPED:
        audioElement.current?.pause();
        audioElement.current && (audioElement.current.currentTime = 0);
        break;
      case PlayStatus.PLAYING:
        audioElement.current?.play();
        break;
      default:
        break;
    }
  }, [playStatus]);

  useEffect(() => {
    setPosition(0);
    audioElement.current && (audioElement.current.currentTime = 0);
    if (autoplay && src) {
      audioElement.current?.play();
    }
  }, [src]);

  const percentage = (position * 100) / (audioElement.current?.duration || 0);

  const clamp1 = clamp(0, audioElement.current?.duration || 0);

  const handleBackward = () => {
    audioElement.current &&
      (audioElement.current.currentTime = clamp1(
        audioElement.current.currentTime - 10,
      ));
  };

  const handleForward = () => {
    audioElement.current &&
      (audioElement.current.currentTime = clamp1(
        audioElement.current.currentTime + 10,
      ));
  };

  return (
    <div className="flex flex-row justify-center items-center">
      <input
        className="slider"
        style={{
          backgroundImage:
            'linear-gradient(to right, #EC4899 0%, #F59E0B ' +
            percentage +
            '%, #FEE2E2 ' +
            percentage +
            '%, #FEF3C7 100%)',
        }}
        type="range"
        min={0}
        max={audioElement.current?.duration || 0}
        value={position}
        onMouseDown={() => setSeeking(true)}
        onChange={(ev) => {
          setPosition(ev.target.valueAsNumber);
        }}
        onMouseUp={() => {
          if (audioElement.current) {
            audioElement.current.currentTime = position;
          }
          audioElement.current?.play();
          setSeeking(false);
        }}
      />
      <audio
        ref={audioElement}
        src={src}
        onTimeUpdate={() => {
          !seeking && setPosition(audioElement.current?.currentTime || 0);
        }}
        onPause={() => setPlayStatus(PlayStatus.PAUSED)}
        onPlaying={() => setPlayStatus(PlayStatus.PLAYING)}
        onEnded={handleEnded}
      ></audio>
      <div className="flex flex-row justify-center items-center transition-all bg-gradient-to-r from-pink-100 via-red-100 to-yellow-100 rounded-full p-2">
        <button className="control" onClick={handlePrevious}>
          {previous}
        </button>
        <div className="flex flex-col items-center">
          <div className="flex flex-row justify-between">
            <button className="control m-1" onClick={handleBackward}>
              {backward}
            </button>
            <button className="control m-1" onClick={handleForward}>
              {forward}
            </button>
          </div>
          <PlayButton
            status={playStatus}
            onClick={() => {
              if (playStatus === PlayStatus.PLAYING) {
                setPlayStatus(PlayStatus.PAUSED);
              } else {
                setPlayStatus(PlayStatus.PLAYING);
              }
            }}
          />
          <div className="flex flex-row justify-center mt-2">
            <button
              className="control"
              onClick={() => setPlayStatus(PlayStatus.STOPPED)}
            >
              {stop}
            </button>
          </div>
        </div>
        <button className="control" onClick={handleNext}>
          {next}
        </button>
      </div>
    </div>
  );
};

export default PlayerControls;
