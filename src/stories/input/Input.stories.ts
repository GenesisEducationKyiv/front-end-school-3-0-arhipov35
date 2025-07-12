import { Meta, StoryObj } from '@storybook/react-vite'; // Updated import for Vite compatibility
import { Input } from './Input';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Example/Input',
  component: Input,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    label: { control: 'text' },
    supportingText: { control: 'text' },
    error: { control: 'boolean' },
    clearable: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    label: 'Label',
    placeholder: 'Input',
    supportingText: 'Supporting text',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Label',
    defaultValue: 'Input',
    supportingText: 'Supporting text',
  },
};

export const Error: Story = {
  args: {
    label: 'Label',
    defaultValue: 'Input',
    supportingText: 'Error message',
    error: true,
  },
};

export const WithoutClearButton: Story = {
  args: {
    label: 'Label',
    defaultValue: 'Input',
    clearable: false,
  },
};

export const WithoutLabel: Story = {
  args: {
    placeholder: 'Input without label',
    supportingText: 'Supporting text',
  },
};
