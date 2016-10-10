import { ControllerManager } from './elements/controllerElement';
import { RegisterElement } from './elements/registerAll';
import { Navigate } from './system/navigate';
import { Loader } from './system/loader';

ControllerManager.setResolver((name) => {
    let url = `/${name.replace('.', '/')}`;
    return Loader.getJs(url);
});

Navigate.instance.onRoute((info) => {
    return new Promise(async (e, r) => {
        let urlHtml, urlJs;
        switch(info.paths.length) {
            case 0:
                urlHtml = '/view/home/index.html';
                urlJs = '/view/home/index';
                break;
            case 1:
                urlHtml = `/view/${info.paths[0]}/index.html`;
                urlJs = `/view/${info.paths[0]}/index`;
                break;
            default:
                urlHtml = `/view/${info.paths[0]}/${info.paths[1]}.html`;
                urlJs = `/view/${info.paths[0]}/${info.paths[1]}`;
        }

        let html = await Loader.getHtml(urlHtml);
        let js = await Loader.getJs(urlJs);
        let data = {
            html: html,
            ctr: js.default
        }
        e(data);
    });
});

RegisterElement();