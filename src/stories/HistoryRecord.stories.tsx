import type { Meta, StoryObj } from '@storybook/react';

import { HistoryEntry } from '../components/History/HistoryEntry';
import albumArt from './assets/albumArt.jpg';

const meta: Meta<typeof HistoryEntry> = {
  title: 'HighLevel/HistoryEntry',
  component: HistoryEntry,
};
export default meta;

type Story = StoryObj<typeof HistoryEntry>;

export const Default: Story = {
  args: {
    albumArt,
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    time: Math.floor((Date.now() - 1000 * 60 * 60 * 7) / 1000),
    position: 34,
    name: 'Bohemian Rhapsody.mp3',
    path: '~/music/A Night at the Opera',
    finished: false,
    hash: 'uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek=',
    handle: undefined,
  },
};

// Photo by <a href="https://unsplash.com/@jakaylatoney?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jakayla Toney</a> on <a href="https://unsplash.com/s/photos/bohemian-rhapsody?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
