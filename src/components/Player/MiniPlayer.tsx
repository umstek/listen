import { Menu } from '@headlessui/react';
import React, { ReactNode, useRef, useState } from 'react';

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
import { formatDuration } from '../../util/formatting';
import { clamp } from '../../util/math';

import './seek-bar.css';

export enum PlayStatus {
  PLAYING,
  PAUSED,
  STOPPED,
}

interface PlayButtonProps {
  status: PlayStatus;
  onClick?: () => void;
}

const PlayButton = ({ status, onClick: handleClick }: PlayButtonProps) => {
  return (
    <button
      className="flex flex-row items-center h-12 w-12 text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 control shadow-pink-500 shadow-md active:shadow-sm active:shadow-red-500"
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
  <Menu as="div">
    <Menu.Button className="control w-8">{selected}</Menu.Button>
    <Menu.Items className="responsive-menu-items-container">
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

interface SeekerProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

function Seeker({ min, max, value, onChange }: SeekerProps) {
  const percentage = clamp(0, 100)((value * 100) / (max - min));

  return (
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
      min={min}
      max={max}
      value={value}
      onChange={(ev) => onChange(Number(ev.target.value))}
    />
  );
}

export enum TimeViewerMode {
  PERCENTAGE = 'percentage',
  DUAL = 'dual',
  ELAPSED = 'elapsed',
  REMAINING = 'remaining',
  DUAL_COMPARISON = 'dual-comparison',
  ELAPSED_COMPARISON = 'elapsed-comparison',
  REMAINING_COMPARISON = 'remaining-comparison',
}

/*
 * Percentage:           40% ....................... 60%
 * Dual:                 12:34 ................... 43:44
 * Elapsed:              12:34 ................... 56:18
 * Remaining:            43:44 ................... 56:18
 * Dual-Comparison:      12:34 / 56:18 ... 43:44 / 56:18
 * Elapsed-Comparison:   12:34 / 56:18 ........... 43:44
 * Remaining-Comparison: 12:34 ........... 43:44 / 56:18
 */

interface TimeViewerSideProps {
  elapsed: number;
  remaining: number;
  duration: number;
  mode: TimeViewerMode;
}

const TimeViewerLeftSide = ({
  elapsed,
  remaining,
  duration,
  mode,
}: TimeViewerSideProps) => {
  let text;

  switch (mode) {
    case TimeViewerMode.PERCENTAGE:
      text = `${Math.round((elapsed * 100) / duration)}%`;
      break;
    case TimeViewerMode.DUAL:
    case TimeViewerMode.ELAPSED:
    case TimeViewerMode.REMAINING_COMPARISON:
      text = formatDuration(elapsed);
      break;
    case TimeViewerMode.REMAINING:
      text = formatDuration(remaining);
      break;
    case TimeViewerMode.DUAL_COMPARISON:
    case TimeViewerMode.ELAPSED_COMPARISON:
      text = `${formatDuration(elapsed)} / ${formatDuration(duration)}`;
      break;
    default:
      text = '';
  }

  return <div className="ml-2 text-sm text-gray-700 font-semibold">{text}</div>;
};

const TimeViewerRightSide = ({
  remaining,
  duration,
  mode,
}: TimeViewerSideProps) => {
  let text;

  switch (mode) {
    case TimeViewerMode.PERCENTAGE:
      text = `${Math.round((remaining * 100) / duration)}%`;
      break;
    case TimeViewerMode.DUAL:
    case TimeViewerMode.ELAPSED_COMPARISON:
      text = formatDuration(remaining);
      break;
    case TimeViewerMode.ELAPSED:
    case TimeViewerMode.REMAINING:
      text = formatDuration(duration);
      break;
    case TimeViewerMode.DUAL_COMPARISON:
    case TimeViewerMode.REMAINING_COMPARISON:
      text = `${formatDuration(remaining)} / ${formatDuration(duration)}`;
      break;
    default:
      text = '';
  }

  return <div className="mr-2 text-sm text-gray-700 font-semibold">{text}</div>;
};

interface MiniPlayerProps {
  trackType: 'music' | 'book';
  duration: number;
  position: number;
  timeMode: TimeViewerMode;
}

export default function MiniPlayer({
  trackType,
  duration,
  position,
  timeMode,
}: MiniPlayerProps) {
  const [value, setValue] = useState(40);

  return (
    <div className="flex flex-col sm:border w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 sm:rounded-lg sm:mr-2 sm:mb-2 shadow-lg bg-white fixed bottom-0 right-0">
      <div className="sm:h-2"></div>
      <Seeker min={0} max={100} value={value} onChange={setValue} />
      <div className="flex flex-row w-full justify-between items-center my-1">
        <div className="flex flex-col items-start">
          <TimeViewerLeftSide
            elapsed={position}
            remaining={duration - position}
            duration={duration}
            mode={timeMode}
          />
          <div className="flex flex-row items-center">
            {trackType === 'music' && (
              <FavoriteButton isFavorite={false} onClick={undefined} />
            )}
            {trackType === 'book' && (
              <BookmarkButton onDelayedBookmarkAdd={undefined} />
            )}
            <button className="control" onClick={undefined}>
              <PrevIcon className="h-6 w-6" />
            </button>
            <button className="control" onClick={undefined}>
              <RewindIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <PlayButton status={PlayStatus.STOPPED} onClick={undefined} />
        <div className="flex flex-col items-end">
          <TimeViewerRightSide
            elapsed={position}
            remaining={duration - position}
            duration={duration}
            mode={timeMode}
          />
          <div className="flex flex-row items-center">
            {/* <button className="control" onClick={undefined}>
              <StopIcon className="h-6 w-6" />
            </button> */}
            <button className="control" onClick={undefined}>
              <FastForwardIcon className="h-6 w-6" />
            </button>
            <button className="control" onClick={undefined}>
              <NextIcon className="h-6 w-6" />
            </button>
            <PlaybackRateButton selected={1.3} />
          </div>
        </div>
      </div>
    </div>
  );
}
