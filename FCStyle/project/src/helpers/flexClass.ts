
export interface Flex {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'reverse';
  order?: 'flex-start' | 'flex-end' | 'center' | 'space-between' |
    'space-around' | 'space-evenly' | 'start' | 'end' | 'left' | 'right';
  align?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline' |
    'first-baseline' | 'last-baseline' | 'start' | 'end' | 'self-start' | 'self-end';
  warp_align?: 'flex-start' | 'flex-end' | 'center' | 'space-between' |
    'space-around' | 'space-evenly' | 'stretch' | 'start' | 'end' | 'baseline' |
    'first-baseline' | 'last-baseline';
  gap?: 0 | 1 | 2 | 3;
}

export interface FlexChildren {
  order?: number;
  grow?: number;
  shrink?: number;
  basis?: 0 | 1 | 2 | 3 | 'auto';
  self?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
}

export class FlexClassBuilder {

    private sets: Flex[];

    constructor(flex: Flex) {
        this.sets = [flex];
    }

    set(flex: Flex): this {
        this.sets.push(flex);
        return this;
    }

    build(): string {
        const mergedProps: Flex = {};
        
        // Loop pelos sets e merge das propriedades (última sobrescreve)
        for (const flexSet of this.sets) {
            Object.assign(mergedProps, flexSet);
        }

        const classes: string[] = [];

        // Direction
        if (mergedProps.direction) {
            if (mergedProps.direction === 'row') {
                classes.push('flex-row');
            } else if (mergedProps.direction === 'row-reverse') {
                classes.push('flex-row', 'inverse');
            } else if (mergedProps.direction === 'column') {
                classes.push('flex-column');
            } else if (mergedProps.direction === 'column-reverse') {
                classes.push('flex-column', 'inverse');
            }
        }

        // Wrap
        if (mergedProps.wrap) {
            if (mergedProps.wrap === 'wrap') {
                classes.push('wrap');
            } else if (mergedProps.wrap === 'reverse') {
                classes.push('wrap-reverse');
            } else if (mergedProps.wrap === 'nowrap') {
                classes.push('nowrap');
            }
        }

        // Justify content (order property)
        if (mergedProps.order) {
            if (mergedProps.order === 'flex-start' || mergedProps.order === 'start') {
                classes.push('justify-start');
            } else if (mergedProps.order === 'flex-end' || mergedProps.order === 'end') {
                classes.push('justify-end');
            } else if (mergedProps.order === 'center') {
                classes.push('justify-center');
            } else if (mergedProps.order === 'space-between') {
                classes.push('justify-between');
            } else if (mergedProps.order === 'space-around') {
                classes.push('justify-around');
            } else if (mergedProps.order === 'space-evenly') {
                classes.push('justify-evenly');
            }
        }

        // Align items
        if (mergedProps.align) {
            if (mergedProps.align === 'stretch') {
                classes.push('align-stretch');
            } else if (mergedProps.align === 'flex-start' || mergedProps.align === 'start' || mergedProps.align === 'self-start') {
                classes.push('align-start');
            } else if (mergedProps.align === 'flex-end' || mergedProps.align === 'end' || mergedProps.align === 'self-end') {
                classes.push('align-end');
            } else if (mergedProps.align === 'center') {
                classes.push('align-center');
            } else if (mergedProps.align === 'baseline' || mergedProps.align === 'first-baseline' || mergedProps.align === 'last-baseline') {
                classes.push('align-baseline');
            }
        }

        // Align content (warp_align property)
        if (mergedProps.warp_align) {
            if (mergedProps.warp_align === 'flex-start' || mergedProps.warp_align === 'start') {
                classes.push('align-content-start');
            } else if (mergedProps.warp_align === 'flex-end' || mergedProps.warp_align === 'end') {
                classes.push('align-content-end');
            } else if (mergedProps.warp_align === 'center') {
                classes.push('align-content-center');
            } else if (mergedProps.warp_align === 'space-between') {
                classes.push('align-content-between');
            } else if (mergedProps.warp_align === 'space-around') {
                classes.push('align-content-around');
            } else if (mergedProps.warp_align === 'space-evenly') {
                classes.push('align-content-evenly');
            } else if (mergedProps.warp_align === 'stretch') {
                classes.push('align-content-stretch');
            } else if (mergedProps.warp_align === 'baseline' || mergedProps.warp_align === 'first-baseline' || mergedProps.warp_align === 'last-baseline') {
                classes.push('align-content-start'); // baseline fallback to start
            }
        }

        // Gap
        if (mergedProps.gap !== undefined) {
            if (mergedProps.gap === 0) {
                classes.push('gap0');
            } else if (mergedProps.gap === 1) {
                classes.push('gap1');
            } else if (mergedProps.gap === 2) {
                classes.push('gap2');
            } else if (mergedProps.gap === 3) {
                classes.push('gap3');
            }
        }

        return classes.join(' ');
    }
}

export class FlexChildrenClassBuilder {

    private sets: FlexChildren[];

    constructor(flex: FlexChildren) {
        this.sets = [flex];
    }

    set(flex: FlexChildren): this {
        this.sets.push(flex);
        return this;
    }

    build(): string {
        const mergedProps: FlexChildren = {};
        
        // Loop pelos sets e merge das propriedades (última sobrescreve)
        for (const flexSet of this.sets) {
            Object.assign(mergedProps, flexSet);
        }

        const classes: string[] = [];

        // Order
        if (mergedProps.order !== undefined) {
            if (mergedProps.order >= 0 && mergedProps.order <= 5) {
                classes.push(`flex-order-${mergedProps.order}`);
            }
        }

        // Grow
        if (mergedProps.grow !== undefined) {
            if (mergedProps.grow >= 0 && mergedProps.grow <= 3) {
                classes.push(`flex-grow-${mergedProps.grow}`);
            }
        }

        // Shrink
        if (mergedProps.shrink !== undefined) {
            if (mergedProps.shrink >= 0 && mergedProps.shrink <= 3) {
                classes.push(`flex-shrink-${mergedProps.shrink}`);
            }
        }

        // Basis
        if (mergedProps.basis !== undefined) {
            if (mergedProps.basis === 'auto') {
                classes.push('flex-basis-auto');
            } else if (mergedProps.basis >= 0 && mergedProps.basis <= 3) {
                classes.push(`flex-basis-${mergedProps.basis}`);
            }
        }

        // Self
        if (mergedProps.self) {
            if (mergedProps.self === 'auto') {
                classes.push('align-self-auto');
            } else if (mergedProps.self === 'flex-start') {
                classes.push('align-self-start');
            } else if (mergedProps.self === 'flex-end') {
                classes.push('align-self-end');
            } else if (mergedProps.self === 'center') {
                classes.push('align-self-center');
            } else if (mergedProps.self === 'baseline') {
                classes.push('align-self-baseline');
            } else if (mergedProps.self === 'stretch') {
                classes.push('align-self-stretch');
            }
        }

        return classes.join(' ');
    }
}