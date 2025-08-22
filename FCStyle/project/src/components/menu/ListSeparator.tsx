import React from 'react';
import { BorderBuilder, BorderShortcuts, classBuilder, ColorBuilder, ColorShortcuts, MarginBuilder, MarginShortcuts } from '../../helpers';

export interface ListSeparatorProps extends React.HTMLAttributes<HTMLDivElement>,
  BorderShortcuts, ColorShortcuts, MarginShortcuts {

  className?: string;
  style?: React.CSSProperties;
}

export const ListSeparator: React.FC<ListSeparatorProps> = ({
  className,
  style,
  ...props
}) => {

  const { domProps, classNames } = classBuilder("list-separator")
    .add(className)
    .addBuilder(ColorBuilder)
    .addBuilder(MarginBuilder)
    .addBuilder(BorderBuilder)
    .build(props);

  return (
    <div
      {...domProps}
      className={classNames}
      style={style}
    />
  );
};
