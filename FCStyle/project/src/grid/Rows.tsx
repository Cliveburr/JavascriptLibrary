import React from 'react';
import { Border, BorderShortcuts, BorderShortcutsProps, classBuilder, Flex, Margin, MarginProps, Padding, PaddingProps } from '../helpers';

export interface RowsProps extends MarginProps, PaddingProps, BorderShortcutsProps {
  children: React.ReactNode;
  inverse?: boolean;
  wrap?: boolean;
  wrap_reverse?: boolean;
  gap?: boolean;
  flex?: Flex;

  // Border
  borderSet?: Border,
  
  className?: string;
  style?: React.CSSProperties;
}

export const Rows: React.FC<RowsProps> = ({
  children,
  inverse = false,
  wrap = false,
  wrap_reverse = false,
  gap = false,
  flex,
  borderSet,
  className = '',
  style,
  ...props
}) => {

  const { domProps, classNames } = classBuilder('flex-column', className)
    .if('inverse', inverse)
    .if('wrap', wrap)
    .if('wrap-reverse', wrap_reverse)
    .if('gap2', gap)
    .ofType(Margin)
    .ofType(Padding)
    .ofType(BorderShortcuts)
    .addFlex(flex)
    .addBorder(borderSet)
    .build(props);

  return (
    <div className={classNames} style={style} {...domProps}>
      {children}
    </div>
  );
};
