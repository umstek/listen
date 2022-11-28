import React from 'react';

import { HistoryEntry } from './HistoryEntry';

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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface HistoryProps {}

// eslint-disable-next-line no-empty-pattern
const History = ({}: HistoryProps) => {

  return (
    <div id="history">
      <div>
        <h1 className="text-6xl font-light">Recently Played</h1>
      </div>
      <div className="mt-8">
        <HistorySection sectionName="A short while ago">
          {/* {history.map((entry) => (
            <HistoryEntry {...entry} key={entry.time} />
          ))} */}
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
