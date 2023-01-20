import type { Meta, StoryObj } from '@storybook/react';

import { Playlist } from '::Playlist';

import albumArt from '../assets/albumArt.jpg';

const meta: Meta<typeof Playlist> = {
  title: 'Playlist/Playlist',
  component: Playlist,
};
export default meta;

type Story = StoryObj<typeof Playlist>;

export const Default: Story = {
  args: {
    items: [
      {
        albumArt,
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        duration: 355,
        playing: false,
        handle: null,
        hash: '675786',
        name: 'gf',
        path: 'thfhg',
      },
      {
        albumArt,
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        duration: 355,
        playing: true,
        handle: null,
        hash: '675786',
        name: 'gf',
        path: 'thfhg',
      },
      {
        albumArt,
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        duration: 355,
        playing: false,
        handle: null,
        hash: '675786',
        name: 'gf',
        path: 'thfhg',
      },
    ],
  },
};

// Photo by <a href="https://unsplash.com/@jakaylatoney?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jakayla Toney</a> on <a href="https://unsplash.com/s/photos/bohemian-rhapsody?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
