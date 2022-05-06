import React, { PropsWithChildren } from 'react';
import { keyframes } from '@stitches/react';
import * as BaseAccordion from '@radix-ui/react-accordion';
import { styled } from '../Theme';

const slideDown = keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-accordion-content-height)' },
});

const slideUp = keyframes({
  from: { height: 'var(--radix-accordion-content-height)' },
  to: { height: 0 },
});

const StyledAccordion = styled(BaseAccordion.Root, {
  borderRadius: '$1',
  backgroundColor: 'transparent',
  width: '100%',
  padding: '$8',
});

const StyledItem = styled(BaseAccordion.Item, {
  overflow: 'hidden',
  padding: '$6 0',
  borderBottom: '$space$px solid $borderLight',
  cursor: 'pointer',
  '&:first-child': {
    marginTop: 0,
    borderTopLeftRadius: '$0',
    borderTopRightRadius: '$0',
  },
  '&:last-child': {
    borderBottom: '0',
  },
  '&:focus-within': {
    position: 'relative',
    zIndex: 1,
    boxShadow: `0 0 0 0.125rem transparent`,
  },
});

const StyledHeader = styled(BaseAccordion.Header, {
  all: 'unset',
  display: 'flex',
});

const StyledTrigger = styled(BaseAccordion.Trigger, {
  all: 'unset',
  fontFamily: 'inherit',
  backgroundColor: 'transparent',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: '$white',
  boxShadow: `0 0 0 $white`,
  '&[data-state="closed"]': { backgroundColor: 'transparent' },
  '&[data-state="open"]': { backgroundColor: 'transparent' },
  '&:hover': { backgroundColor: 'transparent' },
});

const StyledContent = styled(BaseAccordion.Content, {
  overflow: 'hidden',

  '&[data-state="open"]': {
    animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards`,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards`,
  },
});

const StyledChevron = styled('div', {
  color: '$secondaryLight',
  transition: 'transform 300ms cubic-bezier(0.87, 0, 0.13, 1)',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
});

// Exports
export const AccordionRoot = StyledAccordion;
export const AccordionItem = StyledItem;
export const AccordionHeader: React.FC<PropsWithChildren<{ toggleIcon: React.ReactNode }>> = ({
  children,
  toggleIcon,
  ...props
}) => (
  <StyledHeader>
    <StyledTrigger {...props}>
      {children}
      <StyledChevron aria-hidden>{toggleIcon}</StyledChevron>
    </StyledTrigger>
  </StyledHeader>
);

export const AccordionContent: React.FC<PropsWithChildren<BaseAccordion.AccordionContentProps>> = ({
  children,
  ...props
}) => <StyledContent {...props}>{children}</StyledContent>;
