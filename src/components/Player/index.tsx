import React, { useRef, useState } from 'react';

import './styles.css';

interface IPlayerProps {
  src?: string;
}

const Player = ({ src }: IPlayerProps) => {
  const [position, setPosition] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const audioElement = useRef<HTMLAudioElement>(null);

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
        autoPlay
        src={src}
        onTimeUpdate={(ev) => {
          !seeking && setPosition(audioElement.current?.currentTime || 0);
        }}
      ></audio>
    </div>
  );
};

export default Player;
