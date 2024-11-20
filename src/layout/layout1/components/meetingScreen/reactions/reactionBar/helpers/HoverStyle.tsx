import React from 'react';
import { useHover } from './useHover';

interface HoverStyleProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverStyle: React.CSSProperties;
}

export const HoverStyle: React.FC<HoverStyleProps> = ({
  style = {},
  hoverStyle,
  children,
  ...rest
}) => {
  const isHovered = useHover();
  const calculatedStyle = { ...style, ...(isHovered ? hoverStyle : {}) };

  return (
    <div {...rest} style={calculatedStyle}>
      {children}
    </div>
  );
};
