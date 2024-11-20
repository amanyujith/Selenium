import React from 'react';
import { groupBy, Hover, HoverStyle } from './helpers';
import { CounterObject } from './helpers/interface';
import CounterGroup from './CounterGroup';

export interface CounterProps {
  counters?: CounterObject[];
  user?: string;
  onSelect?: (emoji: string) => void;
  onAdd?: () => void;
}

export const Counter = React.forwardRef<
  HTMLDivElement,
  CounterProps
>(
  (
    {
      counters = defaultProps.counters,
      user = defaultProps.user,
      onSelect = defaultProps.onSelect,
      onAdd = defaultProps.onAdd,
    },
    ref
  ) => {
    const groups = groupBy(counters, 'emoji');

    return (
      <Hover ref={ref} style={counterStyle}>
        {Object.keys(groups).map((emoji: string) => {
          const names = groups[emoji].map(({ by }: CounterObject) => {
            return by;
          });
          return (
            <CounterGroup
              key={emoji}
              emoji={emoji}
              count={names.length}
              names={names}
              active={names.includes(user)}
              onSelect={onSelect}
            />
          );
        })}
      </Hover>
    );
  }
);

export const defaultProps: Required<CounterProps> = {
  counters: [
    {
      emoji: '👍',
      by: 'Case Sandberg',
    }
  ],
  user: 'Charlie',
  onAdd: () => {
    
  },
  onSelect: (emoji: string) => {
    
  },
};

const counterStyle = {
  height: '20px',
  width: '30px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  display: 'flex',
  background: '#fff',
};
// const addStyle = {
//   fill: '#4078c0',
//   width: '25px',
//   height: '20px',
//   padding: '1px 1px',
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   cursor: 'pointer',
//   opacity: '0',
//   transition: 'opacity 0.1s ease-in-out',
// };
// const addStyleHover = { opacity: '1' };

export default Counter;