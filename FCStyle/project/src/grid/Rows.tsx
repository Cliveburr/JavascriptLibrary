import React from 'react';

export interface RowsProps {
  children: React.ReactNode;
  inverse?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Rows: React.FC<RowsProps> = ({
  children,
  inverse = false,
  className = '',
  style,
  ...props
}) => {
  const classNames = [
    'flex-column',
    inverse ? 'inverse' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} style={style} {...props}>
      {children}
    </div>
  );
};
