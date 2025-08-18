
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
