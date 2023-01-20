import { ReactNode } from 'react';

import { formatDuration, humanize } from '~util/formatting';

export interface ItemProps {
  albumArt: string;
  title: string;
  artist: string;
  duration: number;
  playing: boolean;
  children?: ReactNode;
  onClick?: () => void;
}

export function Item({
  playing,
  albumArt,
  title,
  artist,
  duration,
  children,
  onClick,
}: ItemProps) {
  return (
    <div
      role="button"
      className="pushable p-2 rounded-lg group flex flex-row text-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100"
      onClick={() => onClick?.()}
    >
      <div className="flex-shrink-0">
        <img
          className={[
            'h-12 rounded-lg ring-offset-1 ring-orange-600 ring-offset-white dark:ring-offset-black',
            playing ? 'ring-2 mr-1' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          src={albumArt}
          alt="Album art"
        />
      </div>
      <div
        className={[
          'flex flex-col justify-between px-2 py-1 overflow-hidden',
          playing ? 'text-orange-600' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="font-bold truncate">{title}</div>
        <div className="text-xs truncate">{artist}</div>
      </div>
      <div className="flex flex-row-reverse items-center flex-grow">
        <div className="group-hover:hidden text-xs" title={humanize(duration)}>
          {formatDuration(duration)}
        </div>
        <div className="hidden group-hover:block">{children}</div>
      </div>
    </div>
  );
}
