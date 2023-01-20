import type { Meta, StoryObj } from '@storybook/react';

import { Item } from '::Playlist/Item';

import albumArt from '../assets/albumArt.jpg';

const meta: Meta<typeof Item> = {
  title: 'Playlist/Item',
  component: Item,
  argTypes: { onClick: { type: 'function' } },
};
export default meta;

type Story = StoryObj<typeof Item>;

export const Default: Story = {
  args: {
    albumArt,
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    duration: 355,
    playing: false,
    children: <button className="pushable p-2">♥</button>,
  },
};

// Photo by <a href="https://unsplash.com/@jakaylatoney?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jakayla Toney</a> on <a href="https://unsplash.com/s/photos/bohemian-rhapsody?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
