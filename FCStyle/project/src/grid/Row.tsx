import React from 'react';

export interface RowProps {
  children: React.ReactNode;
  inverse?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Row: React.FC<RowProps> = ({
  children,
  inverse = false,
  className = '',
  style,
  ...props
}) => {
  const classNames = [
    'row',
    inverse ? 'inverse' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} style={style} {...props}>
      {children}
    </div>
  );
};
