
import { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Example/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    avatar: { control: 'text' },
    header: { control: 'text' },
    subhead: { control: 'text' },
    showMenu: { control: 'boolean' },
    imageUrl: { control: 'text' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    text: { control: 'text' },
    primaryButtonLabel: { control: 'text' },
    secondaryButtonLabel: { control: 'text' },
  },
  decorators: [],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    header: 'Header',
    subhead: 'Subhead',
    title: 'Title',
    subtitle: 'Subtitle',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    primaryButtonLabel: 'Label',
    secondaryButtonLabel: 'Label',
  },
};

export const WithImage: Story = {
  args: {
    header: 'Header',
    subhead: 'Subhead',
    imageUrl: 'https://placehold.co/600x400',
    title: 'Title',
    subtitle: 'Subtitle',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    primaryButtonLabel: 'Label',
    secondaryButtonLabel: 'Label',
  },
};

export const WithMenu: Story = {
  args: {
    header: 'Header',
    subhead: 'Subhead',
    showMenu: true,
    title: 'Title',
    subtitle: 'Subtitle',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    primaryButtonLabel: 'Label',
  },
};

export const HeaderOnly: Story = {
  args: {
    header: 'Header',
    subhead: 'Subhead',
  },
};

export const ContentOnly: Story = {
  args: {
    title: 'Title',
    subtitle: 'Subtitle',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
  },
};

export const ButtonsOnly: Story = {
  args: {
    primaryButtonLabel: 'Primary Action',
    secondaryButtonLabel: 'Secondary Action',
  },
};
