export function ajax(url, data, method, headers, callBack) {
    let client = new XMLHttpRequest();
    client.onreadystatechange = () => {
        if (client.readyState === client.DONE) {
            if (client.status === 200) {
                callBack(true, client.responseText);
            }
            else {
                callBack(false, client.statusText);
            }
        }
    };
    client.onerror = () => {
        callBack(false, client.statusText);
    };
    client.open(method, url, true);
    if (headers) {
        headers.forEach((head) => {
            client.setRequestHeader(head.header, head.value);
        });
    }
    client.send(data);
}
export function getStyle(url, callBack) {
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
export function urlResolve(...urls) {
    let fullUrl = urls.join('/');
    let parts = fullUrl.split('/');
    let trs = [];
    for (let part of parts) {
        switch (part) {
            case '':
            case '.': break;
            case '..':
                trs.pop();
                break;
            default: trs.push(part);
        }
    }
    return trs.join('/');
}
export function parseHtml(html) {
    let div = document.createElement('div');
    div.innerHTML = html;
    return div.childNodes;
}
//# sourceMappingURL=http.js.map