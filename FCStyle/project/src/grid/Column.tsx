import React from 'react';

export interface ColumnProps {
  children: React.ReactNode;
  inverse?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Column: React.FC<ColumnProps> = ({
  children,
  inverse = false,
  className = '',
  style,
  ...props
}) => {
  const classNames = [
    'column',
    inverse ? 'inverse' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} style={style} {...props}>
      {children}
    </div>
  );
};
