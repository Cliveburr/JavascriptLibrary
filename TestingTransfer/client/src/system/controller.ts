import * as fs from 'fs';
import * as path from 'path';

export interface LoaderResonse {
    (success: boolean, data?: string): void;
}

export class Loader {
    public static getHtml(url: string, callBack: LoaderResonse): void {
        let u = path.resolve('../', url);
        if (fs.exists(u)) {
            let content = fs.readFileSync(u).toString();
            callBack(true, content);
        }
        else {
            callBack(false);
        }
    }
}