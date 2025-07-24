import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  primary?: boolean;
  second?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  primary = false,
  second = false,
  className = '',
  ...props
}) => {
  const classNames = [
    'button',
    primary ? 'primary' : '',
    second ? 'second' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
};
