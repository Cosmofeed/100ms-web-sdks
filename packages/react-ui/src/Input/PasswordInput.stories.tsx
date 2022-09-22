import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PasswordInput } from './Input';
import { Box } from '../Layout';
import { useMeasure } from 'react-use';

export default {
  title: 'UI Components/PasswordInput',
  component: PasswordInput.Root,
  argTypes: {
    css: { control: 'object' },
  },
} as ComponentMeta<typeof PasswordInput.Root>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof PasswordInput.Root> = args => {
  const [text, setText] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  return (
    <Box css={{ w: '240px' }}>
      <PasswordInput.Root {...args}>
        <PasswordInput.Input
          css={{ pr: width + 8 }}
          showPassword={showPassword}
          onChange={e => setText(e.target.value)}
        />
        <PasswordInput.Icons ref={ref}>
          <PasswordInput.ShowIcon
            showPassword={showPassword}
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          />
          <PasswordInput.CopyIcon
            onClick={() => {
              navigator.clipboard.writeText(text);
            }}
          />
        </PasswordInput.Icons>
      </PasswordInput.Root>
    </Box>
  );
};

export const Example = Template.bind({});