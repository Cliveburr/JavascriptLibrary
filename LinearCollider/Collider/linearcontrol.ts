import * as Math2D from './math2d';

namespace Spartial2D {

    export enum Directions {
        up = 0,
        down = 1,
        left = 2,
        right = 3,
        upright = 4,
        upleft = 5,
        downright = 6,
        downleft = 7
    }

    export enum Sides {
        upright = 4,
        upleft = 5,
        downright = 6,
        downleft = 7,
        middle = 8
    }
}

export interface IIndexable {
    id: number;
}

// export enum LinkType {
//     downRightToUp = 0,
//     downLeftToUp = 1
// }

// export interface Link {
//     type: LinkType;
//     upObj: LinearObject;
//     downObj: LinearObject;
// }

export class ObjectSide {

    public constructor(
        public obj: LinearObject,
        public type: Spartial2D.Sides
    ) {
    }
}

export class LinearObject implements Math2D.IPoint, IIndexable {
    public static idCount = 0;
    //public links: { [key: number]: Link };
    public sides: { [key: number]: ObjectSide };
    public id: number;

    public constructor(
        public x: number,
        public y: number
    ) {
        //this.links = {};
        this.sides = {};
        this.sides[Spartial2D.Sides.upleft] = new ObjectSide(this, Spartial2D.Sides.upleft);
        this.sides[Spartial2D.Sides.upright] = new ObjectSide(this, Spartial2D.Sides.upright);
        this.sides[Spartial2D.Sides.downleft] = new ObjectSide(this, Spartial2D.Sides.downleft);
        this.sides[Spartial2D.Sides.downright] = new ObjectSide(this, Spartial2D.Sides.downright);
        this.id = LinearObject.idCount++;
    }
}

export class LinearControl {

    public objs: LinearObject[];
    private limits: { [key: number]: LinearObject };
    //public allLinks: Link[] = [];

    public constructor(
        private x: number,
        private y: number,
        private width: number,
        private height: number
    ) {
        this.objs = [];
        this.limits = {};
        this.setLimits();
    }

    private setLimits(): void {

        this.limits[Spartial2D.Sides.upleft] = new LinearObject(this.x, this.y);
        this.limits[Spartial2D.Sides.upright] = new LinearObject(this.x + this.width, this.y);
        this.limits[Spartial2D.Sides.downleft] = new LinearObject(this.x, this.y + this.height);
        this.limits[Spartial2D.Sides.downright] = new LinearObject(this.x + this.width, this.y + this.height);
        this.limits[Spartial2D.Sides.middle] = new LinearObject(this.x + (this.width / 2), this.y + (this.height / 2));
    }

    private createLink(obj0: LinearObject, obj1: LinearObject): void {

        let downObj = obj0.y > obj1.y ? obj0 : obj1;
        let upObj = obj0.y > obj1.y ? obj1 : obj0;
        let objDownIsRight = downObj.x > upObj.x;

        let link: Link = {
            type: objDownIsRight ? LinkType.downRightToUp : LinkType.downLeftToUp,
            upObj,
            downObj
        };

        let downLinkSides = objDownIsRight ? Spartial2D.Sides.upleft : Spartial2D.Sides.upright;
        if (downObj.links[downLinkSides]) {

        }
        else {
            downObj.links[downLinkSides] = link;
        }
        
        let upLinkSides = objDownIsRight ? Spartial2D.Sides.downright : Spartial2D.Sides.downleft;
        if (upObj.links[upLinkSides]) {

        }
        else {
            upObj.links[upLinkSides] = link;
        }

        this.allLinks.push(link);
    }

    private getSideFromTo(from: LinearObject, to: LinearObject): Spartial2D.Sides {
        return from.y > to.y ?
            from.x > to.x ? Spartial2D.Sides.upleft : Spartial2D.Sides.upright :
            from.x > to.x ? Spartial2D.Sides.downleft : Spartial2D.Sides.downright;
    }

    private inverterSide(side: Spartial2D.Sides): Spartial2D.Sides {
        switch (side) {
            case Spartial2D.Sides.downleft: return Spartial2D.Sides.upright;
            case Spartial2D.Sides.downright: return Spartial2D.Sides.upleft;
            case Spartial2D.Sides.upleft: return Spartial2D.Sides.downright;
            case Spartial2D.Sides.upright: return Spartial2D.Sides.downleft;
            default: throw 'Invalid side!';
        }
    }

    private isBetween(from: LinearObject, to: LinearObject, side: Spartial2D.Sides, sub: LinearObject): boolean {
        switch (side) {
            //case Spartial2D.Sides.downleft: return Spartial2D.Sides.upright;
            case Spartial2D.Sides.downright: return (from.x < sub.x && from.y < sub.y) && (to.x > sub.x && to.y > sub.y);
            //case Spartial2D.Sides.upleft: return Spartial2D.Sides.downright;
            //case Spartial2D.Sides.upright: return Spartial2D.Sides.downleft;
            default: throw 'Invalid side!';
        }
    }

    public insert(obj: LinearObject): void {

        if (this.objs.length == 0) {
        
            this.createLink(obj, this.limits[Spartial2D.Sides.downleft]);
            this.createLink(obj, this.limits[Spartial2D.Sides.downright]);
            this.createLink(obj, this.limits[Spartial2D.Sides.upleft]);
            this.createLink(obj, this.limits[Spartial2D.Sides.upright]);

            this.objs.push(obj);
        }
        else {

            // definir a melhor posição de entrada
            let enterSide = this.getSideFromTo(this.limits[Spartial2D.Sides.middle], obj);
            let castingSide = this.inverterSide(enterSide);
            let castingIsDown = castingSide == Spartial2D.Sides.downleft || castingSide == Spartial2D.Sides.downright;

            // ir navegando no sentindo da posição até encontrar sua posição
            let fromObj = this.limits[enterSide];
            let toObj = castingIsDown ? fromObj.links[castingSide].downObj : fromObj.links[castingSide].upObj;
            while (!this.isBetween(fromObj, toObj, castingSide, obj)) {
                fromObj = toObj;
                toObj = castingIsDown ? fromObj.links[castingSide].downObj : fromObj.links[castingSide].upObj;
            }

            // fazer a inserção

        }
    }
}