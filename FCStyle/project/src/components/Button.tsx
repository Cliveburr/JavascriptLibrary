import React from 'react';
import { BorderBuilder, BorderShortcuts, classBuilder, ColorBuilder, ColorShortcuts, FlexChildrenBuilder, FlexChildrenShortcuts, IconSet, MarginBuilder, MarginShortcuts, SizeBuilder, SizeShortcuts } from '../helpers';
import { Icon } from './Icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  BorderShortcuts, ColorShortcuts, FlexChildrenShortcuts, MarginShortcuts, SizeShortcuts {

  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  li?: string;
  leftIcon?: IconSet;
  ri?: string;
  rightIcon?: IconSet;
  as?: 'button' | 'link' | 'submit' | 'reset',
  href?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  style,

  li,
  leftIcon,
  ri,
  rightIcon,
  as,
  href,

  ...props
}) => {

  const { domProps, classNames } = classBuilder("button", "hoverable" /*"p1", "pointer", "border0", "round2", , "clickable-darken" */)
    .add(className)
    .addBuilder(ColorBuilder)
    .addBuilder(MarginBuilder)
    .addBuilder(BorderBuilder)
    .addBuilder(FlexChildrenBuilder)
    .addBuilder(SizeBuilder)
    .build(props);

  // Determinar ícone da esquerda
  const resolvedLeftIcon: IconSet | undefined = leftIcon || (li ? { name: li } : undefined);
  
  // Determinar ícone da direita
  const resolvedRightIcon: IconSet | undefined = rightIcon || (ri ? { name: ri } : undefined);

  const buttonContent = (
    <>
      {resolvedLeftIcon && <Icon icon={resolvedLeftIcon} />}
      {children}
      {resolvedRightIcon && <Icon icon={resolvedRightIcon} />}
    </>
  );

  if (as === 'link' || href) {
    return (
      <a className={classNames} {...domProps} href={href}>
        {buttonContent}
      </a>
    );
  }

  return (
    <button className={classNames} {...domProps}>
      {buttonContent}
    </button>
  );
};
