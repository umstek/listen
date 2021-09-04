import React from 'react';
import { MdRestore as Resume } from 'react-icons/md';
import { MdPlayArrow as Play } from 'react-icons/md';
import { MdDelete as Delete } from 'react-icons/md';

const song = {
  title: 'In The End',
  collection: 'English Music',
  path: 'Linkin Park/Hybrid Theory',
  seekPointPairs: [],
  finished: true,
};

const audioBook = {
  title: '- 02.mp3',
  collection: 'Audio-books',
  path: 'The Hunger Games Trilogy/The Hunger Games - Catching Fire',
  seekPointPairs: [
    { start: 0, end: 23 },
    { start: 23, end: 45 },
    { start: 45, end: 67 },
    { start: 67, end: 89 },
    { start: 89, end: 111 },
    { start: 111, end: 133 },
  ],
  finished: false,
};

const audioBook2 = {
  title: 'Sherlock Holmes The Definitive Collection (Unabridged) - 124.m4b',
  collection: 'Audio-books',
  path: 'Sherlock Holmes',
  seekPointPairs: [
    { start: 0, end: 23 },
    { start: 23, end: 45 },
    { start: 45, end: 67 },
    { start: 67, end: 89 },
    { start: 89, end: 111 },
    { start: 111, end: 133 },
  ],
  finished: false,
};

interface HistoryEntryProps {
  title: string;
  collection: string;
  path: string;
  seekPointPairs: { start: number; end: number }[];
  finished: boolean;
}

const HistoryEntry = ({
  title,
  collection,
  path,
  seekPointPairs,
  finished,
}: HistoryEntryProps) => {
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
      <div className="text-gray-600">{collection}</div>
      <div className="text-gray-600">{path}</div>
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
  return (
    <div id="history">
      <div>
        <h1 className="text-6xl font-light">Recently Played</h1>
      </div>
      <div className="mt-8">
        <HistorySection sectionName="Today">
          <HistoryEntry {...song} />
        </HistorySection>
        <HistorySection sectionName="Yesterday">
          <HistoryEntry {...audioBook} />
          <HistoryEntry {...audioBook} />
          <HistoryEntry {...audioBook} />
        </HistorySection>
        <HistorySection sectionName="Earlier this week">
          <HistoryEntry {...audioBook2} />
        </HistorySection>
        <HistorySection sectionName="Earlier this month"></HistorySection>
        <HistorySection sectionName="Earlier this year"></HistorySection>
        <HistorySection sectionName="A long time ago"></HistorySection>
      </div>
    </div>
  );
};

export default History;
