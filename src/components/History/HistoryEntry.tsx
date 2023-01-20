import { DateTime } from 'luxon';
import { MdRestore as Resume } from 'react-icons/md';
import { MdPlayArrow as Play } from 'react-icons/md';
import { MdDelete as Delete } from 'react-icons/md';

import { HistoryRecord } from '~models/historyRecordSchema';
import { formatDuration } from '~util/formatting';

export function HistoryEntry(hr: HistoryRecord & { albumArt: string }) {
  return (
    <div
      className={[
        `flex flex-row justify-between transition-all group hover:bg-gray-100 text-gray-900 rounded-lg p-3 m-1`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-row">
        <img className="h-24 rounded-lg" src={hr.albumArt} alt="Album Art" />
        <div className="pl-3 flex flex-col justify-between">
          <div>
            <div className="font-medium">{hr.title}</div>
            <div className="text-sm">{hr.artist}</div>
          </div>
          <small>
            <span className="text-gray-400">{hr.path}/</span>
            <span className="text-gray-600">{hr.name}</span>
          </small>
        </div>
      </div>
      <div className="flex flex-col justify-between space-y-2">
        <div className="text-right">
          {formatDuration(hr.position)}
        </div>
        <div className="flex flex-row space-x-4 sm:invisible group-hover:visible">
          <button className="pushable outline-none rounded-full p-1">
            <Play className="h-6 w-6" />
          </button>
          {!hr.finished && (
            <button className="pushable primary outline-none rounded-full p-1">
              <Resume className="h-6 w-6" />
            </button>
          )}
          <button className="pushable outline-none rounded-full p-1">
            <Delete className="h-6 w-6" />
          </button>
        </div>
        <small className="text-right">
          {DateTime.fromMillis(hr.time * 1000).toRelative()}
        </small>
      </div>
    </div>
  );
}
