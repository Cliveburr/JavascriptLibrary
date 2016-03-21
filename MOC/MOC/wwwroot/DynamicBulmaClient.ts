
module moc.client {
    export class Layout implements moc.IObjectDef {
        public getObject(model: any): HTMLElement {
            var s = document.createElement('section');
            s.className = 'hero is-primary is-fullheight';

            this.createHeader(s);

            this.createContent(s);

            this.createFooter(s);

            return s;
        }

        public processChilds(el: HTMLElement, chidls: IObject[]): void {
        }

        private createHeader(el: HTMLElement): void {
            var hero = document.createElement('div');
            hero.className = 'hero-header';
            el.appendChild(hero);

            var header = document.createElement('header');
            header.className = 'header';
            hero.appendChild(header);

            var div = document.createElement('div');
            div.className = 'container';
            div.innerHTML = '<div class="header-left"><a class="header-item" href="#"><img src="images/bulma-white.png" alt="Logo">\
          </a></div><span class="header-toggle"><span></span><span></span><span></span></span><div class="header-right header-menu">\
          <span class="header-item"><a class="is-active" href="#">Home</a></span><span class="header-item"><a href="#">Examples</a>\
          </span><span class="header-item"><a href="#">Documentation</a></span><span class="header-item"><a class="button is-success is-inverted">\
          <i class="fa fa-github"></i>Download</a></span></div>';
            header.appendChild(div);
        }

        private createContent(el: HTMLElement): void {
            var hero = document.createElement('div');
            hero.className = 'hero-content';
            el.appendChild(hero);

            var container = document.createElement('container');
            container.className = 'container';
            container.innerHTML = '<p class="title">title</p><p clas="subtitle">Subtitle</p>';
            hero.appendChild(container);
        }

        private createFooter(el: HTMLElement): void {
            var hero = document.createElement('div');
            hero.className = 'hero-footer';
            el.appendChild(hero);

            var container = document.createElement('div');
            container.className = 'container';
            container.innerHTML = '<label>Footer</label>';
            hero.appendChild(container);
        }
    }

    export class Input implements moc.IObjectDef {
        public getObject(model: any): HTMLElement {
            var p = document.createElement('p');
            p.className = 'control';

            var l = document.createElement('label');
            l.className = 'label';
            l.innerHTML = model.label;
            p.appendChild(l);

            var i = document.createElement('input');
            i.className = 'input';
            i.type = 'text';
            p.appendChild(i);

            if (model.value)
                i.value = model.value;

            return p;
        }
    }

    export class Form implements moc.IObjectDef {
        public getObject(model: any): HTMLElement {
            var form = document.createElement('form');
            form.onsubmit = this.onSubmit;

            return form;
        }

        public preRender(el: HTMLElement): void {
            var p = document.createElement('p');
            p.className = 'control';

            var s = document.createElement('button');
            s.className = 'button is-primary';
            s.innerHTML = 'Submit';
            p.appendChild(s);

            var c = document.createElement('button');
            c.className = 'button';
            c.innerHTML = 'Cancel';
            p.appendChild(c);

            el.appendChild(p);
        }

        private onSubmit(ev: Event): void {
            alert('go');
        }
    }
}