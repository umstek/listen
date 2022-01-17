import { Menu } from '@headlessui/react';
import React, { useRef, useState } from 'react';

import {
  MdPlayArrow as PlayIcon,
  MdPause as PauseIcon,
  MdSkipNext as NextIcon,
  MdSkipPrevious as PrevIcon,
  MdStop as StopIcon,
  MdForward10 as FastForwardIcon,
  MdReplay10 as RewindIcon,
  MdOutlineFavoriteBorder as FavoriteIcon,
  MdOutlineFavorite as FavoritedIcon,
  MdBookmarkBorder as BookmarkIcon,
  MdBookmarkAdded as BookmarkAddedIcon,
  MdUndo as UndoIcon,
} from 'react-icons/md';

import './seek-bar.css';

export enum PlayStatus {
  PLAYING,
  PAUSED,
  STOPPED,
}

interface IPlayButtonProps {
  status: PlayStatus;
  onClick?: () => void;
}

const PlayButton = ({ status, onClick: handleClick }: IPlayButtonProps) => {
  return (
    <button
      className="flex flex-row items-center h-12 w-12 text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 control"
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

const FavoriteButton = ({
  isFavorite,
  onClick: handleClick,
}: {
  isFavorite: boolean;
  onClick?: () => void;
}) => {
  return (
    <button className="control" onClick={handleClick}>
      <span className="mx-auto">
        {isFavorite ? (
          <FavoritedIcon className="h-6 w-6 text-pink-600 fill-current" />
        ) : (
          <FavoriteIcon className="h-6 w-6" />
        )}
      </span>
    </button>
  );
};

const BookmarkButton = ({
  onDelayedBookmarkAdd,
}: {
  onDelayedBookmarkAdd?: () => void;
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const ref = useRef<{ timeout?: NodeJS.Timeout }>({ timeout: undefined });

  const handleClick = () => {
    if (isBookmarked) {
      ref.current.timeout && clearTimeout(ref.current.timeout);
      ref.current.timeout = undefined;
    } else {
      ref.current.timeout = setTimeout(() => {
        onDelayedBookmarkAdd && onDelayedBookmarkAdd();
        setIsBookmarked(false);
      }, 2500);
    }
    setIsBookmarked(!isBookmarked);
  };

  return (
    <button className="control" onClick={handleClick}>
      <span className="mx-auto">
        {isBookmarked ? (
          <BookmarkAddedIcon className="h-6 w-6 text-green-600 fill-current" />
        ) : (
          <BookmarkIcon className="h-6 w-6" />
        )}
      </span>
    </button>
  );
};

const playbackRates = new Set([2, 1.5, 1.25, 1.1, 1, 0.9, 0.75, 0.5]);

const PlaybackRateButton = ({ selected }: { selected: number }) => (
  <Menu as="div" className="relative inline-block text-left">
    <Menu.Button className="pushable outline-none rounded-full p-1 ml-2">
      {selected}
    </Menu.Button>
    <Menu.Items className="fixed sm:absolute p-2 space-y-2 bottom-0 right-0 left-0 sm:left-auto border mt-2 origin-bottom-right bg-white sm:rounded-md shadow-xl focus:outline-none">
      {Array.from(playbackRates.add(selected))
        .sort((a, b) => b - a)
        .map((rate) => (
          <Menu.Item key={rate}>
            {({ active }) => (
              <button
                className={[
                  'menu-item',
                  active && 'bg-gray-100',
                  selected === rate && 'bg-gray-200',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={undefined}
              >
                <span className="w-full">{rate}</span>
              </button>
            )}
          </Menu.Item>
        ))}
    </Menu.Items>
  </Menu>
);

interface MiniPlayerProps {
  trackType: 'music' | 'book';
  duration: number;
  position: number;
}

export default function MiniPlayer({
  trackType,
  duration,
  position,
}: MiniPlayerProps) {
  const [value, setValue] = useState(40);

  const percentage = (value * 100) / 100;

  return (
    <div className="flex flex-col sm:border w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 sm:rounded-lg sm:mr-2 sm:mb-2 shadow-lg bg-white fixed bottom-0 right-0">
      <div className="sm:h-2"></div>
      <input
        className="seek-bar"
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
        max={100}
        value={value}
        onChange={(ev) => setValue(Number(ev.target.value))}
      />
      <div className="flex flex-row w-full justify-between my-1">
        <div className="flex flex-col">
          <div className="text-sm">
            {`${Math.floor(position / 60)}:${Math.floor(
              position % 60,
            )} / ${Math.floor(duration / 60)}:${Math.floor(duration % 60)}`}
          </div>
          <div className="flex flex-row">
            {trackType === 'music' && (
              <FavoriteButton isFavorite={false} onClick={undefined} />
            )}
            {trackType === 'book' && (
              <BookmarkButton onDelayedBookmarkAdd={undefined} />
            )}
            <button className="control" onClick={undefined}>
              <PrevIcon className="h-6 w-6" />
            </button>
            <button className="control m-1" onClick={undefined}>
              <RewindIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <PlayButton status={PlayStatus.STOPPED} onClick={undefined} />
        <div className="flex flex-col">
          <div className="flex flex-row">
            {/* <button className="control" onClick={undefined}>
              <StopIcon className="h-6 w-6" />
            </button> */}
            <button className="control m-1" onClick={undefined}>
              <FastForwardIcon className="h-6 w-6" />
            </button>
            <button className="control" onClick={undefined}>
              <NextIcon className="h-6 w-6" />
            </button>
            <PlaybackRateButton selected={1.3} />
          </div>
        </div>
      </div>
      <div className="flex flex-col"></div>
    </div>
  );
}
