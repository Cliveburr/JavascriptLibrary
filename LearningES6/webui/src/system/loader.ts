
export class Loader {
    public static async getJs(url: string): Promise<any> {
        return new Promise((e, r) => {
            R(url, (err, cls) => {
                if (err) {
                    r(err);
                }
                else {
                    e(cls);
                }
            });
        });
    }

    public static async getHtml(url: string): Promise<string> {
        return new Promise<string>((e, r) => {
            let link = document.createElement('link');
            link.rel = 'import';
            link.href = url;
            link.onload = () => {
                let tmp = link.import.head.getElementsByTagName('template');
                let html = tmp.length > 0 ?
                    tmp.item(0).innerHTML :
                    link.import.body.innerHTML;
                document.head.removeChild(link);
                e(html);
            };
            document.head.appendChild(link);        
        });
    }
}

declare function R(url: string, callBack: (err: any, cls: any) => void): void;