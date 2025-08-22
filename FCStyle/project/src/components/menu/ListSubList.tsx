import React, { useState } from 'react';
import { BorderBuilder, BorderShortcuts, classBuilder, ColorBuilder, ColorShortcuts, FlexChildrenBuilder, FlexChildrenShortcuts, IconSet, MarginBuilder, MarginShortcuts, SizeBuilder, SizeShortcuts } from '../../helpers';
import { Icon } from '../Icon';

export interface ListSubListProps extends React.HTMLAttributes<HTMLDivElement>,
  BorderShortcuts, ColorShortcuts, FlexChildrenShortcuts, MarginShortcuts, SizeShortcuts {

  children: React.ReactNode;
  label: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  li?: string;
  leftIcon?: IconSet;
  defaultExpanded?: boolean;
  expandIcon?: IconSet;
  collapseIcon?: IconSet;
  selectedValue?: any; // Adicionar para detectar itens selecionados
}

export const ListSubList: React.FC<ListSubListProps> = ({
  children,
  label,
  className,
  style,

  li,
  leftIcon,
  defaultExpanded = false,
  expandIcon = { name: 'chevron-right' },
  collapseIcon = { name: 'chevron-down' },
  selectedValue,

  ...props
}) => {

  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Função para verificar se há algum ListItem selecionado nos children
  const hasSelectedChild = React.useMemo(() => {
    const checkChildren = (children: React.ReactNode): boolean => {
      return React.Children.toArray(children).some((child) => {
        if (React.isValidElement(child)) {
          const childType = child.type as any;
          const childProps = child.props as any;
          
          // Se for um ListItem, verificar se está selecionado
          if (childType && typeof childType === 'function' && childType.name === 'ListItem') {
            return childProps.value !== undefined && childProps.value === selectedValue;
          }
          
          // Se for um ListSubList, verificar recursivamente
          if (childType && typeof childType === 'function' && childType.name === 'ListSubList') {
            return checkChildren(childProps.children);
          }
        }
        return false;
      });
    };
    
    return selectedValue !== undefined ? checkChildren(children) : false;
  }, [children, selectedValue]);

  const { domProps, classNames } = classBuilder("list-sublist")
    .add(className)
    .add(isExpanded ? "expanded" : "collapsed")
    .add(hasSelectedChild ? "has-selected" : undefined)
    .addBuilder(ColorBuilder)
    .addBuilder(MarginBuilder)
    .addBuilder(BorderBuilder)
    .addBuilder(FlexChildrenBuilder)
    .addBuilder(SizeBuilder)
    .build(props);

  // Determinar ícone da esquerda
  const resolvedLeftIcon: IconSet | undefined = leftIcon || (li ? { name: li } : undefined);
  
  // Determinar ícone de expansão
  const toggleIcon = isExpanded ? collapseIcon : expandIcon;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Processar children para passar selectedValue para sublists aninhados
  const processedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childType = child.type as any;
      
      // Se for um ListSubList aninhado, passar o selectedValue
      if (childType && typeof childType === 'function' && childType.name === 'ListSubList') {
        return React.cloneElement(child as any, {
          selectedValue: selectedValue,
        });
      }
    }
    return child;
  });

  return (
    <div
      className={classNames}
      style={style}
    >
      <div className="list-sublist-header" onClick={handleToggle}>
        {resolvedLeftIcon && <Icon icon={resolvedLeftIcon} />}
        <span className="list-sublist-label">{label}</span>
        <Icon icon={toggleIcon} className="list-sublist-toggle" />
      </div>
      {isExpanded && (
        <div className="list-sublist-content">
          {processedChildren}
        </div>
      )}
    </div>
  );
};
