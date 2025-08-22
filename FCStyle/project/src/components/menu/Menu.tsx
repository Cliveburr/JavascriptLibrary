import React from 'react';
import { BorderBuilder, BorderShortcuts, classBuilder, ColorBuilder, ColorShortcuts,
    EffectsBuilder,
    EffectsShortcuts,
    MarginBuilder, MarginShortcuts, SizeBuilder, SizeShortcuts } from '../../helpers';

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement>,
  BorderShortcuts, ColorShortcuts, MarginShortcuts, SizeShortcuts, EffectsShortcuts {

  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  selectedValue?: any;
  onItemSelect?: (value: any) => void;
  horizontal?: boolean;
}

export const Menu: React.FC<MenuProps> = ({
  children,
  className,
  style,

  selectedValue,
  onItemSelect,
  horizontal,

  ...props
}) => {

  const { domProps, classNames } = classBuilder()
    .add(className)
    .if('flex-column', !horizontal)
    .if('flex-row', horizontal)
    .addBuilder(ColorBuilder)
    .addBuilder(MarginBuilder)
    .addBuilder(BorderBuilder)
    .addBuilder(SizeBuilder)
    .addBuilder(EffectsBuilder)
    .build(props);

  // Função recursiva para processar children
  const processChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const childType = child.type as any;
        
        // Se for um ListItem, adicionar propriedades de seleção
        if (childType && typeof childType === 'function' && childType.name === 'ListItem') {
          const childProps = child.props as any;
          return React.cloneElement(child as any, {
            selected: childProps.value !== undefined && childProps.value === selectedValue,
            onSelect: onItemSelect || childProps.onSelect,
          });
        }
        
        // Se for um ListSubList, processar seus children recursivamente
        if (childType && typeof childType === 'function' && childType.name === 'ListSubList') {
          const childProps = child.props as any;
          return React.cloneElement(child as any, {
            children: processChildren(childProps.children),
            selectedValue: selectedValue, // Passar selectedValue para o sublist
          });
        }
      }
      return child;
    });
  };

  // Processar children recursivamente
  const enhancedChildren = processChildren(children);

  return (
    <div
      {...domProps}
      className={classNames}
      style={style}
    >
      {enhancedChildren}
    </div>
  );
};
