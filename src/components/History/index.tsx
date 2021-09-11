import React from 'react';
import { DateTime, Duration } from 'luxon';
import { useLiveQuery } from 'dexie-react-hooks';

import { MdRestore as Resume } from 'react-icons/md';
import { MdPlayArrow as Play } from 'react-icons/md';
import { MdDelete as Delete } from 'react-icons/md';

import { db, HistoricalEvent } from '../../util/persistence';

const HistoryEntry = ({
  title,
  collection,
  path,
  position,
  time,
  finished = false,
}: HistoricalEvent & { finished?: boolean }) => {
  return (
    <div
      className={[
        `transition-all group hover:bg-gray-100 hover:text-gray-900 rounded-lg p-3 m-1`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-row justify-between items-start rounded-lg">
        <h3>{title}</h3>
        <div className="flex flex-row space-x-4 sm:invisible group-hover:visible">
          <button className="pushable outline-none rounded-full p-1">
            <Play className="h-6 w-6" />
          </button>
          {!finished && (
            <button className="pushable primary outline-none rounded-full p-1">
              <Resume className="h-6 w-6" />
            </button>
          )}
          <button className="pushable outline-none rounded-full p-1">
            <Delete className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="text-gray-600">
        {collection}/{path}
      </div>
      <div className="text-gray-600">
        {Duration.fromMillis(position * 1000).toFormat('h:mm:ss')}
      </div>
      <div className="text-gray-600 text-sm text-right">
        {DateTime.fromMillis(time).toRelative()}
      </div>
    </div>
  );
};

interface HistorySectionProps {
  children?: React.ReactNode;
  sectionName: string;
}

const HistorySection = ({ children, sectionName }: HistorySectionProps) => {
  return (
    <div className="mt-8 p-2">
      <h2 className="text-3xl font-medium">{sectionName}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
};

interface HistoryProps {}

const History = ({}: HistoryProps) => {
  const history = useLiveQuery(() => db.history.reverse().toArray()) || [];

  return (
    <div id="history">
      <div>
        <h1 className="text-6xl font-light">Recently Played</h1>
      </div>
      <div className="mt-8">
        <HistorySection sectionName="A short while ago">
          {history.map((entry) => (
            <HistoryEntry {...entry} key={entry.time} />
          ))}
        </HistorySection>
        <HistorySection sectionName="Earlier today"></HistorySection>
        <HistorySection sectionName="Yesterday"></HistorySection>
        <HistorySection sectionName="Earlier this week"></HistorySection>
        <HistorySection sectionName="Earlier this month"></HistorySection>
        <HistorySection sectionName="Earlier this year"></HistorySection>
        <HistorySection sectionName="A long time ago"></HistorySection>
      </div>
    </div>
  );
};

export default History;
