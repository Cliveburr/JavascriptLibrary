import { ClassBuilderDef, ifBy, ifSet } from "./classBuilder";

export interface IconSet {
  name?: string;
  size?: 'xs' | 'sm' | 'lg' | 'xl' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x';
  style?: 'solid' | 'regular' | 'light' | 'brands' | 'duotone';
  spin?: boolean;
  pulse?: boolean;
  bounce?: boolean;
  fade?: boolean;
  beat?: boolean;
  shake?: boolean;
  flip?: 'horizontal' | 'vertical' | 'both';
  rotate?: 90 | 180 | 270;
  border?: boolean;
  pull?: 'left' | 'right';
  fixedWidth?: boolean;
}

export interface IconShortcuts {
  // Icon set
  icon?: IconSet;
  
  // Style shortcuts
  solid?: boolean;
  regular?: boolean;
  light?: boolean;
  brands?: boolean;
  duotone?: boolean;
  
  // Size shortcuts
  iconXs?: boolean;
  iconSm?: boolean;
  iconLg?: boolean;
  iconXl?: boolean;
  icon2x?: boolean;
  icon3x?: boolean;
  icon4x?: boolean;
  icon5x?: boolean;
  
  // Animation shortcuts
  spin?: boolean;
  pulse?: boolean;
  bounce?: boolean;
  fade?: boolean;
  beat?: boolean;
  shake?: boolean;
  
  // Transform shortcuts
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  flipBoth?: boolean;
  rotate90?: boolean;
  rotate180?: boolean;
  rotate270?: boolean;
  
  // Layout shortcuts
  border?: boolean;
  pullLeft?: boolean;
  pullRight?: boolean;
  fixedWidth?: boolean;

  // Name shortcuts
  star?: boolean;
  start?: boolean;
  
  // Navigation & Actions
  home?: boolean;
  back?: boolean;
  forward?: boolean;
  up?: boolean;
  down?: boolean;
  left?: boolean;
  right?: boolean;
  menu?: boolean;
  close?: boolean;
  plus?: boolean;
  minus?: boolean;
  edit?: boolean;
  delete?: boolean;
  trash?: boolean;
  save?: boolean;
  copy?: boolean;
  cut?: boolean;
  paste?: boolean;
  undo?: boolean;
  redo?: boolean;
  refresh?: boolean;
  reload?: boolean;
  search?: boolean;
  filter?: boolean;
  sort?: boolean;
  
  // Media & Controls
  play?: boolean;
  pause?: boolean;
  stop?: boolean;
  record?: boolean;
  volume?: boolean;
  mute?: boolean;
  speaker?: boolean;
  music?: boolean;
  video?: boolean;
  camera?: boolean;
  image?: boolean;
  photo?: boolean;
  
  // Communication
  phone?: boolean;
  email?: boolean;
  message?: boolean;
  chat?: boolean;
  comment?: boolean;
  notification?: boolean;
  bell?: boolean;
  envelope?: boolean;
  inbox?: boolean;
  send?: boolean;
  
  // User & Account
  user?: boolean;
  users?: boolean;
  profile?: boolean;
  account?: boolean;
  login?: boolean;
  logout?: boolean;
  lock?: boolean;
  unlock?: boolean;
  key?: boolean;
  shield?: boolean;
  isecurity?: boolean;
  
  // Files & Documents
  file?: boolean;
  folder?: boolean;
  document?: boolean;
  pdf?: boolean;
  excel?: boolean;
  word?: boolean;
  powerpoint?: boolean;
  zip?: boolean;
  download?: boolean;
  upload?: boolean;
  cloud?: boolean;
  backup?: boolean;
  
  // Shopping & Business
  cart?: boolean;
  basket?: boolean;
  shop?: boolean;
  store?: boolean;
  buy?: boolean;
  sell?: boolean;
  money?: boolean;
  dollar?: boolean;
  euro?: boolean;
  credit?: boolean;
  card?: boolean;
  payment?: boolean;
  
  // Status & Indicators
  check?: boolean;
  checkmark?: boolean;
  cross?: boolean;
  warning?: boolean;
  error?: boolean;
  info?: boolean;
  question?: boolean;
  help?: boolean;
  support?: boolean;
  success?: boolean;
  danger?: boolean;
  
  // Technology
  wifi?: boolean;
  bluetooth?: boolean;
  battery?: boolean;
  signal?: boolean;
  network?: boolean;
  server?: boolean;
  database?: boolean;
  code?: boolean;
  bug?: boolean;
  gear?: boolean;
  settings?: boolean;
  config?: boolean;
  
  // Social & Sharing
  share?: boolean;
  like?: boolean;
  heart?: boolean;
  favorite?: boolean;
  bookmark?: boolean;
  tag?: boolean;
  hashtag?: boolean;
  link?: boolean;
  external?: boolean;
  
  // Time & Calendar
  clock?: boolean;
  time?: boolean;
  calendar?: boolean;
  date?: boolean;
  schedule?: boolean;
  timer?: boolean;
  alarm?: boolean;
  
  // Location & Maps
  location?: boolean;
  map?: boolean;
  pin?: boolean;
  marker?: boolean;
  compass?: boolean;
  globe?: boolean;
  world?: boolean;
  
  // Weather
  sun?: boolean;
  moon?: boolean;
  cloudy?: boolean;
  rain?: boolean;
  snow?: boolean;
  weather?: boolean;
}

// Helper functions for generating icon classes
const generateStyleClass = (style: string): string => {
  switch (style) {
    case 'solid': return 'fas';
    case 'regular': return 'far';
    case 'light': return 'fal';
    case 'brands': return 'fab';
    case 'duotone': return 'fad';
    default: return 'fas'; // default to solid
  }
};

const generateSizeClass = (size: string): string => {
  return `fa-${size}`;
};

const generateAnimationClass = (animation: string): string => {
  return `fa-${animation}`;
};

const generateFlipClass = (flip: string): string => {
  if (flip === 'horizontal') return 'fa-flip-horizontal';
  if (flip === 'vertical') return 'fa-flip-vertical';
  if (flip === 'both') return 'fa-flip-horizontal fa-flip-vertical';
  return '';
};

const generateRotateClass = (rotate: number): string => {
  return `fa-rotate-${rotate}`;
};

const generatePullClass = (pull: string): string => {
  return `fa-pull-${pull}`;
};

export const IconBuilder: ClassBuilderDef<IconSet> = {
  props: {
    'icon': ifBy,
    // Style shortcuts
    'solid': ifSet({ style: 'solid' }),
    'regular': ifSet({ style: 'regular' }),
    'light': ifSet({ style: 'light' }),
    'brands': ifSet({ style: 'brands' }),
    'duotone': ifSet({ style: 'duotone' }),
    // Size shortcuts
    'iconXs': ifSet({ size: 'xs' }),
    'iconSm': ifSet({ size: 'sm' }),
    'iconLg': ifSet({ size: 'lg' }),
    'iconXl': ifSet({ size: 'xl' }),
    'icon2x': ifSet({ size: '2x' }),
    'icon3x': ifSet({ size: '3x' }),
    'icon4x': ifSet({ size: '4x' }),
    'icon5x': ifSet({ size: '5x' }),
    // Animation shortcuts
    'spin': ifSet({ spin: true }),
    'pulse': ifSet({ pulse: true }),
    'bounce': ifSet({ bounce: true }),
    'fade': ifSet({ fade: true }),
    'beat': ifSet({ beat: true }),
    'shake': ifSet({ shake: true }),
    // Transform shortcuts
    'flipHorizontal': ifSet({ flip: 'horizontal' }),
    'flipVertical': ifSet({ flip: 'vertical' }),
    'flipBoth': ifSet({ flip: 'both' }),
    'rotate90': ifSet({ rotate: 90 }),
    'rotate180': ifSet({ rotate: 180 }),
    'rotate270': ifSet({ rotate: 270 }),
    // Layout shortcuts
    'border': ifSet({ border: true }),
    'pullLeft': ifSet({ pull: 'left' }),
    'pullRight': ifSet({ pull: 'right' }),
    'fixedWidth': ifSet({ fixedWidth: true }),
    // Name shortcuts
    'star': ifSet({ name: 'star' }),
    'start': ifSet({ name: 'play' }),
    
    // Navigation & Actions
    'home': ifSet({ name: 'home' }),
    'back': ifSet({ name: 'arrow-left' }),
    'forward': ifSet({ name: 'arrow-right' }),
    'up': ifSet({ name: 'arrow-up' }),
    'down': ifSet({ name: 'arrow-down' }),
    'left': ifSet({ name: 'chevron-left' }),
    'right': ifSet({ name: 'chevron-right' }),
    'menu': ifSet({ name: 'bars' }),
    'close': ifSet({ name: 'times' }),
    'plus': ifSet({ name: 'plus' }),
    'minus': ifSet({ name: 'minus' }),
    'edit': ifSet({ name: 'edit' }),
    'delete': ifSet({ name: 'trash' }),
    'trash': ifSet({ name: 'trash' }),
    'save': ifSet({ name: 'save' }),
    'copy': ifSet({ name: 'copy' }),
    'cut': ifSet({ name: 'cut' }),
    'paste': ifSet({ name: 'paste' }),
    'undo': ifSet({ name: 'undo' }),
    'redo': ifSet({ name: 'redo' }),
    'refresh': ifSet({ name: 'sync' }),
    'reload': ifSet({ name: 'sync-alt' }),
    'search': ifSet({ name: 'search' }),
    'filter': ifSet({ name: 'filter' }),
    'sort': ifSet({ name: 'sort' }),
    
    // Media & Controls
    'play': ifSet({ name: 'play' }),
    'pause': ifSet({ name: 'pause' }),
    'stop': ifSet({ name: 'stop' }),
    'record': ifSet({ name: 'circle' }),
    'volume': ifSet({ name: 'volume-up' }),
    'mute': ifSet({ name: 'volume-mute' }),
    'speaker': ifSet({ name: 'volume-up' }),
    'music': ifSet({ name: 'music' }),
    'video': ifSet({ name: 'video' }),
    'camera': ifSet({ name: 'camera' }),
    'image': ifSet({ name: 'image' }),
    'photo': ifSet({ name: 'camera' }),
    
    // Communication
    'phone': ifSet({ name: 'phone' }),
    'email': ifSet({ name: 'envelope' }),
    'message': ifSet({ name: 'comment' }),
    'chat': ifSet({ name: 'comments' }),
    'comment': ifSet({ name: 'comment' }),
    'notification': ifSet({ name: 'bell' }),
    'bell': ifSet({ name: 'bell' }),
    'envelope': ifSet({ name: 'envelope' }),
    'inbox': ifSet({ name: 'inbox' }),
    'send': ifSet({ name: 'paper-plane' }),
    
    // User & Account
    'user': ifSet({ name: 'user' }),
    'users': ifSet({ name: 'users' }),
    'profile': ifSet({ name: 'user-circle' }),
    'account': ifSet({ name: 'user-cog' }),
    'login': ifSet({ name: 'sign-in-alt' }),
    'logout': ifSet({ name: 'sign-out-alt' }),
    'lock': ifSet({ name: 'lock' }),
    'unlock': ifSet({ name: 'unlock' }),
    'key': ifSet({ name: 'key' }),
    'shield': ifSet({ name: 'shield-alt' }),
    'isecurity': ifSet({ name: 'shield-alt' }),
    
    // Files & Documents
    'file': ifSet({ name: 'file' }),
    'folder': ifSet({ name: 'folder' }),
    'document': ifSet({ name: 'file-alt' }),
    'pdf': ifSet({ name: 'file-pdf' }),
    'excel': ifSet({ name: 'file-excel' }),
    'word': ifSet({ name: 'file-word' }),
    'powerpoint': ifSet({ name: 'file-powerpoint' }),
    'zip': ifSet({ name: 'file-archive' }),
    'download': ifSet({ name: 'download' }),
    'upload': ifSet({ name: 'upload' }),
    'cloud': ifSet({ name: 'cloud' }),
    'backup': ifSet({ name: 'hdd' }),
    
    // Shopping & Business
    'cart': ifSet({ name: 'shopping-cart' }),
    'basket': ifSet({ name: 'shopping-basket' }),
    'shop': ifSet({ name: 'store' }),
    'store': ifSet({ name: 'store' }),
    'buy': ifSet({ name: 'shopping-bag' }),
    'sell': ifSet({ name: 'hand-holding-usd' }),
    'money': ifSet({ name: 'dollar-sign' }),
    'dollar': ifSet({ name: 'dollar-sign' }),
    'euro': ifSet({ name: 'euro-sign' }),
    'credit': ifSet({ name: 'credit-card' }),
    'card': ifSet({ name: 'credit-card' }),
    'payment': ifSet({ name: 'credit-card' }),
    
    // Status & Indicators
    'check': ifSet({ name: 'check' }),
    'checkmark': ifSet({ name: 'check' }),
    'cross': ifSet({ name: 'times' }),
    'warning': ifSet({ name: 'exclamation-triangle' }),
    'error': ifSet({ name: 'times-circle' }),
    'info': ifSet({ name: 'info-circle' }),
    'question': ifSet({ name: 'question-circle' }),
    'help': ifSet({ name: 'question-circle' }),
    'support': ifSet({ name: 'life-ring' }),
    'success': ifSet({ name: 'check-circle' }),
    'danger': ifSet({ name: 'exclamation-triangle' }),
    
    // Technology
    'wifi': ifSet({ name: 'wifi' }),
    'bluetooth': ifSet({ name: 'bluetooth' }),
    'battery': ifSet({ name: 'battery-full' }),
    'signal': ifSet({ name: 'signal' }),
    'network': ifSet({ name: 'network-wired' }),
    'server': ifSet({ name: 'server' }),
    'database': ifSet({ name: 'database' }),
    'code': ifSet({ name: 'code' }),
    'bug': ifSet({ name: 'bug' }),
    'gear': ifSet({ name: 'cog' }),
    'settings': ifSet({ name: 'cog' }),
    'config': ifSet({ name: 'cogs' }),
    
    // Social & Sharing
    'share': ifSet({ name: 'share-alt' }),
    'like': ifSet({ name: 'thumbs-up' }),
    'heart': ifSet({ name: 'heart' }),
    'favorite': ifSet({ name: 'star' }),
    'bookmark': ifSet({ name: 'bookmark' }),
    'tag': ifSet({ name: 'tag' }),
    'hashtag': ifSet({ name: 'hashtag' }),
    'link': ifSet({ name: 'link' }),
    'external': ifSet({ name: 'external-link-alt' }),
    
    // Time & Calendar
    'clock': ifSet({ name: 'clock' }),
    'time': ifSet({ name: 'clock' }),
    'calendar': ifSet({ name: 'calendar' }),
    'date': ifSet({ name: 'calendar-alt' }),
    'schedule': ifSet({ name: 'calendar-check' }),
    'timer': ifSet({ name: 'stopwatch' }),
    'alarm': ifSet({ name: 'bell' }),
    
    // Location & Maps
    'location': ifSet({ name: 'map-marker-alt' }),
    'map': ifSet({ name: 'map' }),
    'pin': ifSet({ name: 'map-pin' }),
    'marker': ifSet({ name: 'map-marker-alt' }),
    'compass': ifSet({ name: 'compass' }),
    'globe': ifSet({ name: 'globe' }),
    'world': ifSet({ name: 'globe-americas' }),
    
    // Weather
    'sun': ifSet({ name: 'sun' }),
    'moon': ifSet({ name: 'moon' }),
    'cloudy': ifSet({ name: 'cloud' }),
    'rain': ifSet({ name: 'cloud-rain' }),
    'snow': ifSet({ name: 'snowflake' }),
    'weather': ifSet({ name: 'cloud-sun' }),
  },
  process: (sets: IconSet[]): string => {
    const mergedProps: IconSet = {};
    
    // Loop pelos sets e merge das propriedades (última sobrescreve)
    for (const iconSet of sets) {
      Object.assign(mergedProps, iconSet);
    }

    const classes: string[] = [];

    // Style (fas, far, fal, fab, fad)
    if (mergedProps.style) {
      const styleClass = generateStyleClass(mergedProps.style);
      if (styleClass) classes.push(styleClass);
    } else {
      // Default to solid if no style specified
      classes.push('fas');
    }

    // Icon name
    if (mergedProps.name) {
      classes.push(`fa-${mergedProps.name}`);
    }

    // Size
    if (mergedProps.size) {
      const sizeClass = generateSizeClass(mergedProps.size);
      if (sizeClass) classes.push(sizeClass);
    }

    // Animations
    if (mergedProps.spin) classes.push('fa-spin');
    if (mergedProps.pulse) classes.push('fa-pulse');
    if (mergedProps.bounce) classes.push('fa-bounce');
    if (mergedProps.fade) classes.push('fa-fade');
    if (mergedProps.beat) classes.push('fa-beat');
    if (mergedProps.shake) classes.push('fa-shake');

    // Transforms
    if (mergedProps.flip) {
      const flipClass = generateFlipClass(mergedProps.flip);
      if (flipClass) {
        flipClass.split(' ').forEach(cls => classes.push(cls));
      }
    }

    if (mergedProps.rotate) {
      const rotateClass = generateRotateClass(mergedProps.rotate);
      if (rotateClass) classes.push(rotateClass);
    }

    // Layout
    if (mergedProps.border) classes.push('fa-border');
    if (mergedProps.pull) {
      const pullClass = generatePullClass(mergedProps.pull);
      if (pullClass) classes.push(pullClass);
    }
    if (mergedProps.fixedWidth) classes.push('fa-fw');

    return classes.join(' ');
  }
};
