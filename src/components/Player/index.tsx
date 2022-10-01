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
import * as mmb from 'music-metadata-browser';

import type { HistoricalEvent } from '../../util/persistence';
import { requestPermission } from '../../util/fileSystem';
import { getMetadata } from '../../util/metadata';
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
  activeFile?: FileSystemFileHandle;
  collection: string;
  path: string;
  autoplay?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onEnded: () => void;
  onHistoricalEvent: (event: HistoricalEvent) => void;
}

const PlayerControls = ({
  collection,
  path,
  activeFile,
  autoplay = true,
  onPrevious: handlePrevious,
  onNext: handleNext,
  onEnded: handleEnded,
  onHistoricalEvent,
}: IPlayerControlsProps) => {
  const [position, setPosition] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [playStatus, setPlayStatus] = useState(PlayStatus.STOPPED);
  const [audioSource, setAudioSource] = useState<string | undefined>(undefined);
  const [audioMetadata, setAudioMetadata] = useState<
    mmb.IAudioMetadata | undefined
  >(undefined);

  const audioElement = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (activeFile === undefined) {
      return;
    }

    const f = async () => {
      if ((await requestPermission(activeFile, 'read')) !== 'granted') {
        return;
      }

      const fileData: File = await activeFile.getFile();
      const metadata = await getMetadata(fileData);
      setAudioMetadata(metadata);
      const source = URL.createObjectURL(fileData);
      setAudioSource(source);
    };

    f();

    return () => {
      audioSource && URL.revokeObjectURL(audioSource);
    };
  }, [activeFile]);

  useEffect(() => {
    activeFile &&
      audioMetadata &&
      onHistoricalEvent({
        collection,
        path,
        fileName: activeFile.name,
        file: activeFile,
        title: audioMetadata.common.title || activeFile.name,
        position: Math.floor(position / 60) * 60,
        time: Date.now(),
      });
  }, [
    onHistoricalEvent,
    collection,
    path,
    activeFile,
    audioMetadata,
    Math.floor(position / 60),
  ]);

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
    if (autoplay && audioSource) {
      audioElement.current?.play();
    }
  }, [audioSource]);

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
    <div className="z-10 fixed flex w-screen flex-col-reverse md:flex-row items-end md:p-4 md:w-auto right-0 bottom-0 pointer-events-none">
      <div className="flex flex-col w-full md:w-auto justify-end md:rounded-2xl bg-white shadow-md pl-4 pr-4 py-4 md:pr-24 transform md:translate-x-24 border-t pointer-events-auto">
        <div className="flex flex-row flex-grow justify-between items-center ml-3 mr-3">
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
                audioElement.current.play();
              }
              setSeeking(false);
            }}
          />
          <div className="w-24 text-right">
            {Duration.fromMillis(
              1000 * (audioElement.current?.duration || 0),
            ).toFormat('hh:mm:ss')}
          </div>
        </div>

        <div className="md:text-right mt-2">
          <div className="text-gray-600 ml-4 md:ml-0 md:mr-4 truncate overflow-ellipsis">
            {collection}
          </div>
          <div className="text-gray-600 ml-4 md:ml-0 md:mr-4 truncate overflow-ellipsis">
            {path}
          </div>
          <h3 className="text-lg truncate overflow-ellipsis ml-4 md:ml-0 mt-2">
            {audioMetadata?.common.track.no}/{audioMetadata?.common.track.of}
            {' - '}
            {audioMetadata?.common.title || activeFile?.name}
          </h3>
        </div>

        <audio
          ref={audioElement}
          src={audioSource}
          onTimeUpdate={() => {
            !seeking && setPosition(audioElement.current?.currentTime || 0);
          }}
          onPause={() => setPlayStatus(PlayStatus.PAUSED)}
          onPlaying={() => setPlayStatus(PlayStatus.PLAYING)}
          onEnded={handleEnded}
        ></audio>
      </div>

      <div className="rounded-full p-2 bg-white shadow-md z-0 border pointer-events-auto">
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
          <button
            className="control"
            onClick={() => {
              handleNext();
            }}
          >
            <NextIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
