import { Border, Color, Gap, Margin, Padding } from "./utilitiesClass";

export const filterStylePropsBy = (style: any[], props: any) => {
  const allStyleKeys = style.map(s => Object.values(s)).flat();
  
  const filteredProps = { ...props };
  allStyleKeys.forEach((key: any) => {
    delete filteredProps[key];
  });
  
  return filteredProps;
};

export const filterStyleProps = (props: any) => {
  const allStyleKeys = [
    ...Object.values(Gap),
    ...Object.values(Margin),
    ...Object.values(Padding),
    ...Object.values(Color),
    ...Object.values(Border)
  ];
  
  const filteredProps = { ...props };
  allStyleKeys.forEach(key => {
    delete filteredProps[key];
  });
  
  return filteredProps;
};