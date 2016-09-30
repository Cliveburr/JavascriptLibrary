// import { LinkManager } from './elements/linkElement';
// import { ControllerManager, IClassDefault } from './binding/controller';
// import { Navigate, IRouteInfo, IRouteDataSignature } from './system/navigate';

// class HomeController {

// }

// export class App {
//     public static navigate: Navigate;

//     public static start(): void {
//         App.navigate = new Navigate(App.onRoute);
//         ControllerManager.setResolver(App.resolverCtr);
//     }

//     public static onRoute(info: IRouteInfo, callBack: IRouteDataSignature): void {
//         let data = {
//             html: `<div>Route:${info.paths.length > 0 ? info.paths.join('.'): 'none'}</div>`,
//             ctr: HomeController
//         }
//         callBack(data);
//     }

//     public static resolverCtr(name: string): Promise<IClassDefault> {
//         let url = `./${name.replace('.', '/')}`;
//         return new Promise((e, r) => {
//             R(url, (err, cls) => {
//                 if (err) {
//                     console.log(err.statusText);
//                     r(err);
//                 }
//                 else {
//                     e(cls);
//                 }
//             });
//         });
//     }
// }

// declare function R(url: string, callBack: (err: any, cls: IClassDefault) => void): void;