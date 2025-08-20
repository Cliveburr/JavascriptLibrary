import React from 'react';
import { IconBuilder, IconShortcuts, classBuilder, ColorBuilder, ColorShortcuts, MarginBuilder, MarginShortcuts } from '../helpers';

export interface IconProps extends React.HTMLAttributes<HTMLElement>,
  IconShortcuts, ColorShortcuts, MarginShortcuts {

  name?: string;
  className?: string;
  style?: React.CSSProperties;
  
  as?: 'i' | 'span';
  title?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  className,
  style,
  title,
  as = 'i',
  ...props
}) => {

  // Construir os dados, mas só incluir name se estiver definido
  const buildData = name ? { ...props, icon: { name } } : { ...props };
  
  const { domProps, classNames } = classBuilder()
    .add(className)
    .addBuilder(IconBuilder)
    .addBuilder(ColorBuilder)
    .addBuilder(MarginBuilder)
    .build(buildData);

  const Element = as;

  return (
    <Element 
      className={classNames} 
      style={style}
      title={title}
      aria-hidden="true"
      {...domProps}
    />
  );
};
