import React from 'react';
import { classBuilder, Color, ColorProps, Margin, MarginProps, Padding, PaddingProps, BorderProps, Border, Flex } from '../helpers';

export interface PlaceProps extends React.ButtonHTMLAttributes<HTMLDivElement>,
  ColorProps, MarginProps, PaddingProps, BorderProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  hoverable?: boolean;
  pointer?: boolean;
  flex?: Flex;
  style?: React.CSSProperties;
}

export const Place: React.FC<PlaceProps> = ({
  children,
  className = '',
  selected,
  hoverable,
  pointer,
  flex,
  style,
  ...props
}) => {

  const { domProps, classNames } = classBuilder(className)
    .if('selected', selected)
    .if('hoverable', hoverable)
    .if('pointer', pointer)
    .ofType(Color)
    .ofType(Margin)
    .ofType(Padding)
    .ofType(Border)
    .addFlex(flex)
    .build(props);

  return (
    <div className={classNames} style={style} {...domProps}>
      {children}
    </div>
  );
};
