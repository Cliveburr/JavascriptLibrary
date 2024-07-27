import '../declarations/array.extends';
import { WsClient, SDom, Provider, Router, Routes, RouteOutlet, AttrProvider, IRoute } from '../http/index';
import { LiveReload } from './livereload';
import { HomeCode } from '../view/home.code';
import { ViewCode } from '../view/view.view';
import { IndexView } from '../view/index.view';
import { TagProvider } from '../http/providers/tag/tag.provider';

window.runs ||= 1;
console.log('Client running...', window.runs++);

const handleError = (error?: any): boolean => {
    return true;
}

const handleReconnect = (): void => {
    liveReload.reboot();
}

const ws = new WsClient(handleError, handleReconnect);
ws.connect();

const liveReload = ws.openPath<LiveReload>('livereload', LiveReload);
liveReload.start();

// class firstTest {
//     static injector = ['snode']
//     constructor(
//         private snode: SNode
//     ) {
//     }

//     init(): void {
//         this.snode.events.push({ name: 'click' });
//     }

//     click(): void {
//         console.log('hit clica');
//     }
// }

const tags = new TagProvider([
    { tag: 'route-outlet', cls: RouteOutlet }
]);

const dom = new SDom(
    new Provider([new AttrProvider()]),
    new Provider([tags]),
    new Router()
);

// let firstTime = true;
// dom.onActionsEnds = () => {
//     //TODO: temporario até arrumar outra forma melhor
//     if (firstTime) {
//         firstTime = false;
//         dom.router.navigate(window.document.location.pathname);
//     }
// }

const routes: IRoute[] = [
    { route: 'home', code: HomeCode },
    { route: 'view', code: ViewCode }
]

// dom.body
//     .childs.set(
dom.router.boot(
        { code: Routes, data: routes },
        { code: IndexView },
        // { tag: 'h1', content: 'header' },
        // { childs: [
        //     { tag: 'a', content: 'home', attr: [ { name: 'href', value: '/home' } ] },
        //     { tag: 'a', content: 'view', attr: [ { name: 'href', value: '/view' } ] },
        //     { childs: [
        //         { tag: 'button', content: 'testando' }
        //     ] },
        //     //{ tag: 'button', content: 'test2' }
        // ]},
        // { tag: 'br' },
        // { tag: 'br' },
        // { code: RouteOutlet },
        // { tag: 'h2', content: 'bottom' },
        //{ tag: 'button', content: 'clica', code: firstTest }
        { code: Routes, data: <IRoute[]>[{ route: '', redirect: 'home'}] }
    )
    // .then(() => {
    //     dom.router.navigate(window.document.location.pathname);
    // });