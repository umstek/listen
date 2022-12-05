import type { Meta, StoryObj } from '@storybook/react';

import { Menu } from '~components/Playlist/Menu';

const meta: Meta<typeof Menu> = {
  title: 'Playlist/Menu',
  component: Menu,
};
export default meta;

type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  args: {},
};
