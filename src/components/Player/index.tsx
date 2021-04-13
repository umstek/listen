import React, { useEffect, useRef, useState } from 'react';

import { PlayStatus } from '../PlayerControls';

import './styles.css';

interface IPlayerProps {
  src?: string;
  status: PlayStatus;
  onPause: () => void;
  onPlaying: () => void;
  onEnded: () => void;
}

const Player = ({
  src,
  status,
  onPause: handlePause,
  onPlaying: handlePlaying,
  onEnded: handleEnded,
}: IPlayerProps) => {
  const [position, setPosition] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const audioElement = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    switch (status) {
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
  }, [status]);

  const percentage = (position * 100) / (audioElement.current?.duration || 0);

  return (
    <div>
      <input
        className="slider"
        style={{
          backgroundImage:
            'linear-gradient(to right, #DB2777 0%, #7C3AED ' +
            percentage +
            '%, #FCE7F3 ' +
            percentage +
            '%, #FCE7F3 100%)',
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
        onTimeUpdate={(ev) => {
          !seeking && setPosition(audioElement.current?.currentTime || 0);
        }}
        onPause={handlePause}
        onPlaying={handlePlaying}
        onEnded={handleEnded}
      ></audio>
    </div>
  );
};

export default Player;
