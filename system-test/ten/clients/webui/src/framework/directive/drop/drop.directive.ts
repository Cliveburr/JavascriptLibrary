import { AfterViewInit, ContentChild, ContentChildren, Directive, ElementRef, HostListener, Input, OnInit, QueryList, Renderer2 } from "@angular/core";
import { ButtonComponent } from "src/framework/component";
import { DropBodyDirective } from "./drop-body.directive";
import { DropClickDirective } from "./drop-click.directive";
import { DropIconDirective } from "./drop-icon.directive";

@Directive({
    selector: '[t-drop]'
})
export class DropDirective implements AfterViewInit, OnInit {

    public static dropsToClose: DropDirective[] = [];

    @Input('t-drop') tdrop?: string;
    @ContentChild(DropClickDirective) dropclick?: DropClickDirective;
    @ContentChild(DropBodyDirective) dropbody?: DropBodyDirective;
    @ContentChild(ButtonComponent) buttonComp?: ButtonComponent;
    @ContentChildren(DropIconDirective, { descendants: false, read: ElementRef }) dropIcon!: QueryList<ElementRef>;

    public el: HTMLElement;
    public isActive: boolean;

    private onWindowClickBind: any;

    public constructor(
        elementRef: ElementRef,
        private render: Renderer2
    ) {
        this.el = elementRef.nativeElement;
        this.isActive = false;
        this.onWindowClickBind = this.onWindowClick.bind(this);
    }

    public ngOnInit(): void {
        this.tdrop ||= 'down';
    }

    public ngAfterViewInit(): void {
        this.dropclick?.setDrop(this);
        this.dropbody?.setDrop(this);
        this.checkButtonComp();
    }

    public show(): void {
        this.isActive = true;
        this.dropbody?.show();
        this.render.addClass(this.el, 'active');
        this.checkButtonComp();
        DropDirective.closeOthersDropNotParent(this.el);
        DropDirective.dropsToClose.push(this);
    }

    public close(): void {
        this.isActive = false;
        this.dropbody?.close();
        this.render.removeClass(this.el, 'active');
        this.checkButtonComp();
        const index = DropDirective.dropsToClose.indexOf(this);
        DropDirective.dropsToClose.splice(index, 1);
        if (this.dropclick) {
            window.removeEventListener('click', this.dropclick.onWindowClickBind);
        }
        else {
            window.removeEventListener('click', this.onWindowClickBind);
        }
    }

    @HostListener('click', ['$event'])
    public onHostClick(event: MouseEvent): void {
        if (!this.dropclick && !this.isActive) {
            window.addEventListener('click', this.onWindowClickBind);
            event.cancelBubble = true;
            this.show();
        }
    }

    public onWindowClick(event: MouseEvent) {
        if (this.isActive) {
            this.close();
        }
    }

    public static closeOthersDropNotParent(origin: any): void {
        const dropsParents = DropDirective.dropsToClose
            .filter(d => !this.checkIsParent(origin, d.el, 3));
        dropsParents
            .forEach(d => {
                d.close();
            });
    }

    private static checkIsParent(origin: any, el: any, limit: number): boolean {
        if (origin && limit > 0) {
            if (el === origin) {
                return true;
            }
            else {
                return DropDirective.checkIsParent(origin.parentElement, el, --limit);
            }
        }
        else {
            return false;
        }
    }

    private checkButtonComp(): void {
        if (this.buttonComp) {
            switch (this.tdrop) {
                case 'down':
                    {
                        if (this.isActive) {
                            this.buttonComp.rightIcon = 'angle-up';
                        }
                        else {
                            this.buttonComp.rightIcon = 'angle-down'
                        }
                        break;
                    }
            }
            this.buttonComp.changes.detectChanges();
        }
        if (this.dropIcon.length > 0) {
            const el = this.dropIcon.first.nativeElement;
            switch (this.tdrop) {
                case 'right':
                    {
                        if (this.isActive) {
                            this.render.removeClass(el, 'icon-rr');
                            this.render.addClass(el, 'icon-rl');
                        }
                        else {
                            this.render.removeClass(el, 'icon-rl');
                            this.render.addClass(el, 'icon-rr');
                        }
                        break;
                    }
            }
        }
    }
}