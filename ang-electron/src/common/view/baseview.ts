import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class BaseView {

    public constructor(
        public route: ActivatedRoute,
        public router: Router
    ) {
    }
}