
export enum Gap {
  gap_1 = 'gap-1',
  gap0 = 'gap0',
  gap = 'gap',
  gap1 = 'gap1'
}

export type GapProps = {
  [K in Gap]?: boolean;
};

export enum Margin {
  m_1 = 'm-1',
  m0 = 'm0',
  m = 'm',
  m1 = 'm1',
  ma = 'ma',
  // Margin Top
  mt_1 = 'mt-1',
  mt0 = 'mt0',
  mt = 'mt',
  mt1 = 'mt1',
  mta = 'mta',
  // Margin Right
  mr_1 = 'mr-1',
  mr0 = 'mr0',
  mr = 'mr',
  mr1 = 'mr1',
  mra = 'mra',
  // Margin Bottom
  mb_1 = 'mb-1',
  mb0 = 'mb0',
  mb = 'mb',
  mb1 = 'mb1',
  mba = 'mba',
  // Margin Left
  ml_1 = 'ml-1',
  ml0 = 'ml0',
  ml = 'ml',
  ml1 = 'ml1',
  mla = 'mla',
  // Margin X (horizontal)
  mx_1 = 'mx-1',
  mx0 = 'mx0',
  mx = 'mx',
  mx1 = 'mx1',
  mxa = 'mxa',
  // Margin Y (vertical)
  my_1 = 'my-1',
  my0 = 'my0',
  my = 'my',
  my1 = 'my1',
  mya = 'mya'
}

export type MarginProps = {
  [K in Margin]?: boolean;
};

export enum Padding {
  p_1 = 'p-1',
  p0 = 'p0',
  p = 'p',
  p1 = 'p1',
  // Padding Top
  pt_1 = 'pt-1',
  pt0 = 'pt0',
  pt = 'pt',
  pt1 = 'pt1',
  // Padding Right
  pr_1 = 'pr-1',
  pr0 = 'pr0',
  pr = 'pr',
  pr1 = 'pr1',
  // Padding Bottom
  pb_1 = 'pb-1',
  pb0 = 'pb0',
  pb = 'pb',
  pb1 = 'pb1',
  // Padding Left
  pl_1 = 'pl-1',
  pl0 = 'pl0',
  pl = 'pl',
  pl1 = 'pl1',
  // Padding X (horizontal)
  px_1 = 'px-1',
  px0 = 'px0',
  px = 'px',
  px1 = 'px1',
  // Padding Y (vertical)
  py_1 = 'py-1',
  py0 = 'py0',
  py = 'py',
  py1 = 'py1'
}

export type PaddingProps = {
  [K in Padding]?: boolean;
};

export enum Color {
  one = 'one',
  two = 'two',
  three = 'three',
  four = 'four',
  five = 'five',
  six = 'six',
  seven = 'seven',
  success = 'success',
  warning = 'warning',
  danger = 'danger'
}

export type ColorProps = {
  [K in Color]?: boolean;
};

export enum Border {
  // Border Width
  border0 = 'border0',
  border = 'border',
  border1 = 'border1',
  border2 = 'border2',
  // Border Top
  border_t0 = 'border-t0',
  border_t = 'border-t',
  border_t1 = 'border-t1',
  border_t2 = 'border-t2',
  // Border Right
  border_r0 = 'border-r0',
  border_r = 'border-r',
  border_r1 = 'border-r1',
  border_r2 = 'border-r2',
  // Border Bottom
  border_b0 = 'border-b0',
  border_b = 'border-b',
  border_b1 = 'border-b1',
  border_b2 = 'border-b2',
  // Border Left
  border_l0 = 'border-l0',
  border_l = 'border-l',
  border_l1 = 'border-l1',
  border_l2 = 'border-l2',
  // Border X (Left and Right)
  border_x0 = 'border-x0',
  border_x = 'border-x',
  border_x1 = 'border-x1',
  border_x2 = 'border-x2',
  // Border Y (Top and Bottom)
  border_y0 = 'border-y0',
  border_y = 'border-y',
  border_y1 = 'border-y1',
  border_y2 = 'border-y2',
  // Border Radius
  rounded0 = 'rounded0',
  rounded = 'rounded',
  rounded1 = 'rounded1',
  rounded2 = 'rounded2',
  // Border Radius Top
  rounded_t0 = 'rounded-t0',
  rounded_t = 'rounded-t',
  rounded_t1 = 'rounded-t1',
  rounded_t2 = 'rounded-t2',
  // Border Radius Right
  rounded_r0 = 'rounded-r0',
  rounded_r = 'rounded-r',
  rounded_r1 = 'rounded-r1',
  rounded_r2 = 'rounded-r2',
  // Border Radius Bottom
  rounded_b0 = 'rounded-b0',
  rounded_b = 'rounded-b',
  rounded_b1 = 'rounded-b1',
  rounded_b2 = 'rounded-b2',
  // Border Radius Left
  rounded_l0 = 'rounded-l0',
  rounded_l = 'rounded-l',
  rounded_l1 = 'rounded-l1',
  rounded_l2 = 'rounded-l2',
  // Border Width
  border_outset = 'border-outset',
  border_outset1 = 'border-outset1',
  border_outset2 = 'border-outset2',
}

export type BorderProps = {
  [K in Border]?: boolean;
};

export interface Border1 {
  style?: 'none' | 'solid';
  width?: 0 | 1 | 2 | 3;
  roudend?: 0 | 1 | 2 | 3;
  apply?: 'all' | 't' | 'r' | 'b' | 'l' | 'x' | 'y';
}