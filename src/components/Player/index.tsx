import React, { useEffect, useRef, useState } from 'react';
import { Duration } from 'luxon';
import {
  MdPlayArrow as PlayIcon,
  MdPause as PauseIcon,
  MdSkipNext as NextIcon,
  MdSkipPrevious as PrevIcon,
  MdStop as StopIcon,
  MdForward10 as FastForwardIcon,
  MdReplay10 as RewindIcon,
} from 'react-icons/md';

import type { HistoricalEvent } from 'src/util/persistence';
import { clamp } from '../../util/math';

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
        {status === PlayStatus.PLAYING ? (
          <PauseIcon className="h-6 w-6" />
        ) : (
          <PlayIcon className="h-6 w-6" />
        )}
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
  onHistoricalEvent: (event: HistoricalEvent) => void;
}

const PlayerControls = ({
  src,
  autoplay = true,
  onPrevious: handlePrevious,
  onNext: handleNext,
  onEnded: handleEnded,
  onHistoricalEvent: handleHistoricalEvent,
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
    <div className="z-10 fixed flex flex-row items-end p-4 right-0 bottom-0">
      <div className="flex flex-col justify-end rounded-2xl bg-white shadow-md pl-4 py-4 pr-24 transform translate-x-24">
        <div className="flex flex-row justify-between items-center mr-3">
          <div className="w-24 text-left">
            {Duration.fromMillis(position * 1000).toFormat('hh:mm:ss')}
          </div>
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
          <div className="w-24 text-right">
            {Duration.fromMillis(
              1000 * (audioElement.current?.duration || 0),
            ).toFormat('hh:mm:ss')}
          </div>
        </div>

        <div className="text-right mt-2">
          <div className="text-gray-600 mr-4">Audio-books</div>
          <div className="text-gray-600 mr-4">
            Sir Arthur Conan Doyle/Sherlock Holmes
          </div>
          <h3 className="text-lg truncate overflow-ellipsis mt-2">
            Sherlock Holmes The Definitive Collection (Unabridged) - 015.m4b
          </h3>
        </div>

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
      </div>

      <div className="rounded-full p-2 bg-white shadow-md z-0">
        <div className="flex flex-row justify-center items-center transition-all bg-gradient-to-r from-pink-100 via-red-100 to-yellow-100 rounded-full p-2">
          <button className="control" onClick={handlePrevious}>
            <PrevIcon className="h-6 w-6" />
          </button>
          <div className="flex flex-col items-center">
            <div className="flex flex-row justify-between">
              <button className="control m-1" onClick={handleBackward}>
                <RewindIcon className="h-6 w-6" />
              </button>
              <button className="control m-1" onClick={handleForward}>
                <FastForwardIcon className="h-6 w-6" />
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
                <StopIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <button className="control" onClick={handleNext}>
            <NextIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
