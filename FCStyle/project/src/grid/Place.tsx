import React from 'react';
import { classBuilder, Color, ColorProps, Margin, MarginProps, Padding,
  PaddingProps, BorderShortcutsProps, BorderShortcuts, Flex, Border } from '../helpers';

export interface PlaceProps extends React.ButtonHTMLAttributes<HTMLDivElement>,
  ColorProps, MarginProps, PaddingProps, BorderShortcutsProps {
  children: React.ReactNode;
  className?: string;

  // Common shortcuts
  selected?: boolean;
  hoverable?: boolean;
  pointer?: boolean;

  // Flex shortcuts
  column?: boolean;
  row?: boolean;
  gap?: boolean;
  grow?: boolean;
  flex?: Flex;

  // Border
  borderSet?: Border,
  
  style?: React.CSSProperties;
}

export const Place: React.FC<PlaceProps> = ({
  children,
  className = '',
  selected,
  hoverable,
  pointer,
  column,
  row,
  gap,
  grow,
  flex,
  borderSet,
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
    .ofType(BorderShortcuts)
    .addFlexIf({ direction: 'row' }, column)
    .addFlexIf({ direction: 'column' }, row)
    .addFlexIf({ gap: 2 }, gap)
    .addChildrenFlexIf({ grow: 1 }, grow)
    .addFlex(flex)
    .addBorder(borderSet)
    .build(props);

  return (
    <div className={classNames} style={style} {...domProps}>
      {children}
    </div>
  );
};
