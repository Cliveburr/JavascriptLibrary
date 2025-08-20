import React from 'react';
import { classBuilder, ColorBuilder, ColorShortcuts, MarginBuilder, MarginShortcuts, PaddingBuilder,
  PaddingShortcuts, BorderShortcuts, BorderBuilder, FlexBuilder, FlexShortcuts, FlexChildrenBuilder,
  FlexChildrenShortcuts, SizeBuilder, SizeShortcuts } from '../helpers';

export interface PlaceProps extends React.ButtonHTMLAttributes<HTMLDivElement>,
  ColorShortcuts, MarginShortcuts, PaddingShortcuts, BorderShortcuts, FlexShortcuts,
  FlexChildrenShortcuts, SizeShortcuts {

  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  // Common shortcuts
  pointer?: boolean;
}

export const Place: React.FC<PlaceProps> = ({
  children,
  className,
  style,

  pointer,

  ...props
}) => {

  const { domProps, classNames } = classBuilder()
    .add(className)
    .if('pointer', pointer)
    .addBuilder(ColorBuilder)
    .addBuilder(MarginBuilder)
    .addBuilder(PaddingBuilder)
    .addBuilder(BorderBuilder)
    .addBuilder(FlexBuilder)
    .addBuilder(FlexChildrenBuilder)
    .addBuilder(SizeBuilder)
    .build(props);

  return (
    <div className={classNames} style={style} {...domProps}>
      {children}
    </div>
  );
};
