import React from 'react';
import { Place, PlaceProps } from './Place';

export interface ColumnsProps extends PlaceProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Columns: React.FC<ColumnsProps> = ({
  children,
  className,
  style,
  ...props
}) => {

  return (
    <Place row className={className} style={style} {...props}>
      {children}
    </Place>
  );
};
// import React from 'react';
// import { BorderBuilder, BorderShortcuts, classBuilder, Flex, Margin, MarginProps, Padding, PaddingProps } from '../helpers';

// export interface ColumnsProps extends MarginProps, PaddingProps, BorderShortcuts {
//   children: React.ReactNode;
//   inverse?: boolean;
//   wrap?: boolean;
//   wrap_reverse?: boolean;
//   gap?: boolean;
//   flex?: Flex;

//   className?: string;
//   style?: React.CSSProperties;
// }

// export const Columns: React.FC<ColumnsProps> = ({
//   children,
//   inverse = false,
//   wrap = false,
//   wrap_reverse = false,
//   gap = false,
//   flex,
//   className = '',
//   style,
//   ...props
// }) => {

//   const { domProps, classNames } = classBuilder('flex-row', className)
//     .if('inverse', inverse)
//     .if('wrap', wrap)
//     .if('wrap-reverse', wrap_reverse)
//     .if('gap2', gap)
//     .ofType(Margin)
//     .ofType(Padding)
//     .addFlex(flex)
//     .addBuilder(BorderBuilder)
//     .build(props);

//   return (
//     <div className={classNames} style={style} {...domProps}>
//       {children}
//     </div>
//   );
// };
