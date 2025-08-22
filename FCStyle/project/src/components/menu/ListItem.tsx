import React from 'react';
import { BorderBuilder, BorderShortcuts, classBuilder, ColorBuilder, ColorShortcuts, FlexChildrenBuilder, FlexChildrenShortcuts, IconSet, MarginBuilder, MarginShortcuts, SizeBuilder, SizeShortcuts } from '../../helpers';
import { Icon } from '../Icon';

export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement>,
  BorderShortcuts, ColorShortcuts, FlexChildrenShortcuts, MarginShortcuts, SizeShortcuts {

  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  li?: string;
  leftIcon?: IconSet;
  ri?: string;
  rightIcon?: IconSet;
  disabled?: boolean;
  selected?: boolean;
  value?: any;
  onSelect?: (value: any) => void;
}

export const ListItem: React.FC<ListItemProps> = ({
  children,
  className,
  style,

  li,
  leftIcon,
  ri,
  rightIcon,
  disabled,
  selected,
  value,
  onSelect,

  ...props
}) => {

  const { domProps, classNames } = classBuilder("list-item")
    .add(className)
    .add(selected ? "selected" : undefined)
    .add(disabled ? "disabled" : undefined)
    .add(!disabled ? "hoverable" : undefined)
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

  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect(value);
    }
  };

  return (
    <div
      className={classNames}
      style={style}
      onClick={handleClick}
    >
      {resolvedLeftIcon && <Icon icon={resolvedLeftIcon} />}
      <span className="list-item-content">{children}</span>
      {resolvedRightIcon && <Icon icon={resolvedRightIcon} />}
    </div>
  );
};
