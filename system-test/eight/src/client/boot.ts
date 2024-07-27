

const modules: { [mod: string]: string } = {
    'tslib': 'node_modules/tslib/tslib.js'
};
const validExts = [
    'js', 'html'
];
window.cache = {};
window.contentCache = {};
window.module = <any>{};

function detectDependencies(content: string): string[] {
    const result: string[] = [];
    const requireRegex = /^\s*const.*require\s*\(\s*[\"\'](.*)[\"\']\s*\).*$/mg;
    let reg: RegExpExecArray | null;
    while (reg = requireRegex.exec(content)) {
        result.push(reg[1]!);
    }
    const directRequreRegex = /^\s*require\s*\(\s*[\"\'](.*)[\"\']\s*\).*$/mg;
    while (reg = directRequreRegex.exec(content)) {
        result.push(reg[1]!);
    }
    const tslibRequireRegex = /^\s*tslib.*\.\_\_exportStar.*require\s*\(\s*[\"\'](.*)[\"\']\s*\).*$/mg;
    while (reg = tslibRequireRegex.exec(content)) {
        result.push(reg[1]!);
    }
    return result;
}

function resolveFilePath(file: string, parent: string): { fullFile: string, folder: string } {

    const isMod = modules[file];
    if (isMod) {
        return {
            fullFile: isMod,
            folder: parent
        }
    }

    const parts = parent.split(/[\/\\]+/).filter(s => s != '');
    parts.push(...(file.toLowerCase().split(/[\/\\]+/)
        .filter(s => s != '')));

    let pathParts: string[] = [];
    for (const part of parts) {
        switch (part) {
            case '.':
                continue;
            case '..':
                pathParts = pathParts.slice(0, pathParts.length - 1);
                continue;
            default:
                pathParts.push(part);
        }
    }

    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart) {
        const fileType = lastPart.split('.');
        const ext = fileType[fileType.length - 1]!;
        if (validExts.indexOf(ext) < 0) {
            pathParts[pathParts.length - 1] = lastPart + '.js';
        }
    }

    const fullFile = pathParts.join('/');
    const folder = pathParts.slice(0, pathParts.length - 1).join('/');

    return { fullFile, folder };
}

function directRequire(parent: string, file: string): any {

    const resol = resolveFilePath(file, parent);
    let expt = window.cache[resol.fullFile];
    if (expt) {
        return expt;
    }
    else {
        throw `Invalid file: \"${resol.fullFile}\" for parent \"${parent}\"`;
    }
}

async function seRequire(parent: string, file: string): Promise<any> {

    const resol = resolveFilePath(file, parent);
    let expt = window.cache[resol.fullFile];
    if (expt) {
        return expt;
    }

    let content = window.contentCache[resol.fullFile];
    if (!content) {
        content = window.contentCache[resol.fullFile] = await loadFile(resol.fullFile);
    }

    if (resol.fullFile.endsWith('.js')) {
        const deps = detectDependencies(content);
        // const loadAllDependencies = deps.map(d => seRequire(resol.folder, d));
        // await Promise.all(loadAllDependencies);
        for (const dep of deps) {
            await seRequire(resol.folder, dep);
        }

        const contentRef = content + '\n//# sourceURL=' + resol.fullFile;
        expt = {};
        window.exports = window.module.exports = expt;
        window.require = directRequire.bind(seRequire, resol.folder);
        eval(contentRef);
        delete window.exports;
        delete window.module.exports;
        window.require = seRequire.bind(seRequire, '');

        window.cache[resol.fullFile] = expt;
        
        return expt;
    }
    else if (resol.fullFile.endsWith('.html')) {
        return content;
    }
    else {
        throw 'Not support file extension! ' + file;
    }
}

function loadFile(file: string): Promise<string> {
    return new Promise<string>((r, e) => {

        var ajax = new XMLHttpRequest();

        ajax.onreadystatechange = (ev): void => {
            if (ajax.readyState === ajax.DONE) {
                if (ajax.status === 200) {
                    r(ajax.responseText);
                } else {
                    e(ajax.statusText);
                }
            }
        };

        ajax.onerror = (): void => {
            e(ajax.statusText);
        };

        ajax.open('GET', file, true);
        ajax.send();
    });
}

window.bootClient = async function () {
    try {
        await seRequire('', 'main/main');
    } catch (err) {
        if (err.message && err.stack) {
            console.error(err.message);
            console.error(err.stack);
        }
        else {
            console.error('Error:', err);
        }
    }
}

window.bootClient();