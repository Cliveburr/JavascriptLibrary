import { Directive, ElementRef, Renderer2 } from "@angular/core";
import { DropDirective } from "./drop.directive";

@Directive({
    selector: '[t-drop-body]'
})
export class DropBodyDirective {

    private drop?: DropDirective;
    private el: HTMLElement;
    
    public constructor(
        elementRef: ElementRef,
        private render: Renderer2
    ) {
        this.el = elementRef.nativeElement;
        this.close();
    }

    public setDrop(drop: DropDirective): void {
        this.drop = drop;
    }

    public show(): void {

        const clickEl = this.drop?.dropclick ?
            this.drop.dropclick.el :
            this.drop?.el;
        if (!clickEl) {
            throw 'Need to set t-drop-click on child element of t-drop to work!';
        }

        const direction = this.drop?.tdrop;
        let inset = '';
        let transform = '';
        switch (direction) {
            case 'down':
            case 'down left':
                {
                    inset = '0 auto auto 0';
                    const height = clickEl.offsetHeight + 3;
                    transform = `translate(0, ${height}px)`;
                    break;
                }
            case 'down right':
                {
                    inset = '0 0 auto auto';
                    const height = clickEl.offsetHeight + 3;
                    transform = `translate(0, ${height}px)`;
                    break;
                }
            case 'up':
            case 'up left':
                {
                    inset = 'auto auto 0 0';
                    const height = clickEl.offsetHeight + 3;
                    transform = `translate(0, -${height}px)`;
                    break;
                }
            case 'up right':
                {
                    inset = 'auto 0 0 auto';
                    const height = clickEl.offsetHeight + 3;
                    transform = `translate(0, -${height}px)`;
                    break;
                }
            case 'right':
                {
                    inset = '0 auto auto 0';
                    const width = clickEl.offsetWidth + 3;
                    transform = `translate(${width}px, 0)`;
                    break;
                }
            case 'right up':
                {
                    inset = 'auto auto 0 0';
                    const width = clickEl.offsetWidth + 3;
                    transform = `translate(${width}px, 0)`;
                    break;
                }
            case 'left':
            case 'left down':
                {
                    inset = '0 auto auto 0';
                    const oldDisplay = this.el.style.display;
                    this.el.style.display = 'block';;
                    const width = this.el.offsetWidth + 3;
                    this.el.style.display = oldDisplay;
                    transform = `translate(-${width}px, 0)`;
                    break;
                }
            case 'left up':
                {
                    inset = 'auto auto 0 0';
                    const oldDisplay = this.el.style.display;
                    this.el.style.display = 'block';;
                    const width = this.el.offsetWidth + 3;
                    this.el.style.display = oldDisplay;
                    transform = `translate(-${width}px, 0)`;
                    break;
                }
            default:
                throw 'Invalid t-drop value: ' + direction;
        }

        this.render.setStyle(this.el, 'inset', inset);
        this.render.setStyle(this.el, 'transform', transform);
        this.render.removeClass(this.el, 'hide');
        this.render.addClass(this.el, 'show');
    }

    public close(): void {
        this.render.removeClass(this.el, 'show');
        this.render.addClass(this.el, 'hide');
        this.render.removeStyle(this.el, 'inset');
        this.render.removeStyle(this.el, 'transform');
    }
}