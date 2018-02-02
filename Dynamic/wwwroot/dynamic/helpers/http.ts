
export interface IAjaxRequestHeader {
    header: string;
    value: string;
}

export interface IAjaxCallBack {
    (success: boolean, data: string): void;
}

export function ajax(url: string, data: any, method: string, headers?: IAjaxRequestHeader[], callBack?: IAjaxCallBack): void {
    let client = new XMLHttpRequest();

    client.onreadystatechange = () => {
        if (client.readyState === client.DONE) {
            if (client.status === 200) {
                callBack(true, client.responseText);
            } else {
                callBack(false, client.statusText);
            }
        }
    };

    client.onerror = () => {
        callBack(false, client.statusText);
    }

    client.open(method, url, true);

    if (headers) {
        headers.forEach((head) => {
            client.setRequestHeader(head.header, head.value);
        });
    }

    client.send(data);
}

export function getStyle(url: string, callBack: IAjaxCallBack): void {
    let link = document.createElement('link');
    link.rel = 'stylesheet';

    link.onload = () => {
        callBack(true, null);
    };

    link.onerror = () => {
        callBack(false, 'Error loading script: ' + url);
    };

    link.href = url;

    document.head
        .appendChild(link)
        .parentNode
        .removeChild(link);
}

export function urlResolve(...urls: string[]): string {
    let fullUrl = urls.join('/');
    let parts = fullUrl.split('/');
    let trs: Array<string> = [];
    for (let part of parts) {
        switch (part) {
            case '':
            case '.': break;
            case '..': trs.pop(); break;
            default: trs.push(part);
        }
    }
    return trs.join('/');
}

export function parseHtml(html: string): NodeList {
    let div = document.createElement('div');
    div.innerHTML = html;
    return div.childNodes;
}