import React from 'react';
import { BorderBuilder, BorderShortcuts, classBuilder, ColorBuilder, ColorShortcuts, MarginBuilder, MarginShortcuts, SizeBuilder, SizeShortcuts } from '../../helpers';

export interface ListLabelProps extends React.HTMLAttributes<HTMLDivElement>,
  BorderShortcuts, ColorShortcuts, MarginShortcuts, SizeShortcuts {

  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ListLabel: React.FC<ListLabelProps> = ({
  children,
  className,
  style,
  ...props
}) => {

  const { domProps, classNames } = classBuilder("list-label")
    .add(className)
    .addBuilder(ColorBuilder)
    .addBuilder(MarginBuilder)
    .addBuilder(BorderBuilder)
    .addBuilder(SizeBuilder)
    .build(props);

  return (
    <div
      {...domProps}
      className={classNames}
      style={style}
    >
      {children}
    </div>
  );
};
