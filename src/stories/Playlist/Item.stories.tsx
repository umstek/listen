import type { Meta, StoryObj } from '@storybook/react';

import { Item } from '~components/Playlist/Item';

const meta: Meta<typeof Item> = {
  title: 'Playlist/Item',
  component: Item,
};
export default meta;

type Story = StoryObj<typeof Item>;

export const Default: Story = {
  args: {},
};
