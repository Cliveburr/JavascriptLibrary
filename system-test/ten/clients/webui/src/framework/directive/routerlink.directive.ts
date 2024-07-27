import { LocationStrategy } from '@angular/common';
import { Directive, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkWithHref } from "@angular/router";
import { BaseService } from '..';

@Directive({
    selector: 'a[t-routeLink]' 
}) 
export class RouterLinkDirective extends RouterLinkWithHref {

    @Input('t-routeLink') tRoute?: string;

    public constructor(
        private base: BaseService,
        router: Router,
        route: ActivatedRoute,
        locationStrategy: LocationStrategy
    ) {
        super(router, route, locationStrategy)
    }

    public ngOnInit(): void {
        this.routerLink = (this.tRoute || '')
            .replace('[session]', this.base.session.profile?.nickName || '');
    }
}
