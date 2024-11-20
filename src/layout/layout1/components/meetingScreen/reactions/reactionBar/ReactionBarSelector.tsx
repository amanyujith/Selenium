import React from 'react';
import { Reaction } from './helpers/types';
import ReactionBarSelectorEmoji from './ReactionBarSelectorEmoji';
import RaiseHand from '../raiseHand/raiseHand';

export interface ReactionBarSelectorProps {
  iconSize?: number;
  reactions?: Reaction[];
  onSelect?: (key: string) => void;
  style?: React.CSSProperties;
}

export const ReactionBarSelector = React.forwardRef<
  HTMLDivElement,
  ReactionBarSelectorProps
>(
  (
    {
      iconSize = defaultProps.iconSize,
      reactions = defaultProps.reactions,
      onSelect = defaultProps.onSelect,
      style = defaultProps.style,
    },
    ref
  ) => {
    const emojiStyle = React.useMemo(() => {
      return {
        width: `${iconSize + 10}px`,
        height: `${iconSize + 10}px`,
        display: 'flex',
        alignItems: 'center',
        fontSize: iconSize,
      };
    }, [iconSize]);

    return (
      <div ref={ref} style={{ ...wrapStyle, ...style }}>
        <RaiseHand />
        {reactions.map((reaction: Reaction) => {
          return (
            <div style={emojiStyle} key={reaction.key ?? reaction.label}>
              <ReactionBarSelectorEmoji
                reaction={reaction}
                onSelect={onSelect}
              />
            </div>
          );
        })}
      </div>
    );
  }
);

export const defaultProps: Required<ReactionBarSelectorProps> = {
  style: {},
  reactions: [{ label: 'raised_hand', node: '🤚', key: "raised_hand" },
  { label: "smile", node: '😊', key: "smile" },
  { label: "heart", node: '❤️', key: "heart" },
  { label: "100", node: '💯', key: "100" },
  { label: "like", node: '👍', key: "like" },
  { label: "clap", node: '👏', key: "clap" }
  ],
  iconSize: 26,
  onSelect: (key: string) => {
  },
};

const wrapStyle = {
  backgroundColor: '#000000',
  borderRadius: '3px',
  padding: '5px 10px',
  boxShadow: '0 0 0 1px rgba(0, 0, 0, .05), 0 1px 2px rgba(0, 0, 0, .15)',
  display: 'flex',
  width: 'fit-content',
};

export default ReactionBarSelector;
