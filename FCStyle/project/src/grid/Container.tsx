import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  style,
  ...props
}) => {
  const classNames = [
    className
  ].join(' ');

  return (
    <div className={classNames} style={style} {...props}>
      {children}
    </div>
  );
};
