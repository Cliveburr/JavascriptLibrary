
export interface IVector {
    x: number;
    y: number;
}


export interface IPoint {
    x: number;
    y: number;
}

export interface IRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function intersect(r1: IRectangle, r2: IRectangle): Boolean {
    return !(r2.x > (r1.x + r1.width)
        || (r2.x + r2.width) < r1.x
        || r2.y > (r1.y + r1.height)
        || (r2.y + r2.height) < r1.y);
}

export function inside(container: IRectangle, test: IRectangle): Boolean {
    return (container.x < test.x)
        && (container.x + container.width > test.x + test.width)
        && (container.y < test.y)
        && (container.y + container.height > test.y + test.height);
}