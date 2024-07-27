import { OutgoingHttpHeaders } from 'http';
import * as path from 'path';
import * as fs from 'fs';
import { Dictionary } from '../../helpers';
import { DiagnosticLevel, IPipeline, IRequestContext } from '../models';

export interface FileType {
    extension: string;
    contentType: string;
}

export const defaultFileTypes: FileType[] = [
    { extension: '.js', contentType: 'text/javascript' },
    { extension: '.map', contentType: 'application/json' },
    { extension: '.ts', contentType: 'text/x-typescript' },
    { extension: '.html', contentType: 'text/html' },
    { extension: '.css', contentType: 'text/css' },
    { extension: '.bmp', contentType: 'image/bmp' },
    { extension: '.gif', contentType: 'image/gif' },
    { extension: '.jpg', contentType: 'image/jpg' },
    { extension: '.png', contentType: 'image/png' },
    { extension: '.ico', contentType: 'image/x-icon' },
    { extension: '.json', contentType: 'application/json' },
    { extension: '.svg', contentType: 'image/svg+xml' },
    { extension: '.ttf', contentType: 'application/x-font-ttf' },
    { extension: '.otf', contentType: 'application/x-font-opentype' },
    { extension: '.woff', contentType: 'application/font-woff' },
    { extension: '.woff2', contentType: 'application/font-woff2' },
    { extension: '.eot', contentType: 'application/vnd.ms-fontobject' },
    { extension: '.sfnt', contentType: 'application/font-sfnt' }
];

class FileInfo {
    public hasContent: boolean | undefined;
    public headers: OutgoingHttpHeaders;
    public statusCode: number;
    public isValid: boolean;

    public constructor(
        public file: string,
        public requestHeaders: OutgoingHttpHeaders,
        public fileTypes: Dictionary<string>
    ) {
        this.statusCode = 0;
        this.headers = {};
        this.isValid = this.checkFile();
    }

    private checkFile(): boolean {
        if (!fs.existsSync(this.file)) {
            return false;
        }

        if (!this.checkContenType()) {
            return false;
        }

        if (!this.checkContentAndCache()) {
            return false;
        }        

        return true;
    }

    private checkContenType(): boolean {
        let extension = path.extname(this.file);
        if (extension == '.gz') {
            extension = path.extname(this.file.substr(0, this.file.length - 3));
            let contentType = this.fileTypes.get(extension);
            if (contentType) {
                this.headers['Content-Encoding'] = 'gzip';
                this.headers['Content-Type'] = contentType;
                return true;
            }
        }
        else {
            let contentType = this.fileTypes.get(extension);
            if (contentType) {
                this.headers['Content-Type'] = contentType;
                return true;
            }
        }
        return false;
    }

    private checkContentAndCache(): boolean {
        if (this.requestHeaders['cache-control'] && this.requestHeaders['cache-control'] == 'no-cache') {
            this.statusCode = 200;
            this.hasContent = true;
            return true;
        }

        let modified = fs.statSync(this.file).mtime;
        modified.setMilliseconds(0);

        this.headers['Last-Modified'] = modified.toString();
        this.headers['Cache-Control'] = 'private';
        
        let modifiendSince = this.requestHeaders['if-modified-since'];
        if (modifiendSince) {
            let since = new Date(modifiendSince.toString());
            since.setMilliseconds(0);

            if (modified.getTime() <= since.getTime()) {
                this.statusCode = 304;
                return true;
            }
        }

        this.statusCode = 200;
        this.hasContent = true;
        return true;
    }
}

export class StaticFiles implements IPipeline {

    private fileTypes: Dictionary<string>;

    public constructor(
        private wwwroot: string,
        fileTypes?: FileType[]
    ) {
        this.fileTypes = new Dictionary<string>();
        for (let type of fileTypes || defaultFileTypes) {
            this.fileTypes.set(type.extension, type.contentType);
        }
    }

    public process(ctx: IRequestContext, next: () => void): void {
        
        let file = path.resolve(this.wwwroot + ctx.req.url);
        let fileInfo = new FileInfo(file, ctx.req.headers, this.fileTypes);

        if (fileInfo.isValid) {
            ctx.log(`${ctx.req.method}:${fileInfo.statusCode}:${file}`);

            ctx.res.writeHead(fileInfo.statusCode, fileInfo.headers);
            if (fileInfo.hasContent) {
                ctx.res.write(fs.readFileSync(file));
            }
            ctx.processed = true;
        }
        else {
            ctx.log(`${ctx.req.method}:INVALID:${file}`, DiagnosticLevel.Detail);
        }

        next();
    }
}