import { ISNode } from "./models";

interface IParseContext {
    text: string;
    pos: number;
    start: number;
    char?: string;
    dchar?: string;
    tags: string[];
    snode: ISNode;
    action: (ctx: IParseContext) => void;
    temp1?: string;
    backAction?: (ctx: IParseContext) => void;
}

function tagValue(ctx: IParseContext): void {
    if (ctx.char == ' ' || ctx.char == '>' || ctx.dchar == '/>') {
        const fullValue = ctx.text.substr(ctx.start, ctx.pos - ctx.start);
        const strValue = fullValue.substr(1, fullValue.length - 2);
        ctx.snode.attr ||= [];
        ctx.snode.attr.push({ name: ctx.temp1!, value: strValue });
        ctx.pos--;
        ctx.action = tagMiddle;
    }
}

function tagName(ctx: IParseContext): void {
    if (ctx.char == '=') {
        const name = ctx.text.substr(ctx.start, ctx.pos - ctx.start);
        ctx.temp1 = name;
        ctx.start = ctx.pos + 1;
        ctx.action = tagValue;
    }
    else if (ctx.char == ' ' || ctx.char == '>' || ctx.dchar == '/>') {
        const name = ctx.text.substr(ctx.start, ctx.pos - ctx.start);
        ctx.snode.attr ||= [];
        ctx.snode.attr.push({ name });
        ctx.pos--;
        ctx.action = tagMiddle;
    }
}

function tagMiddle(ctx: IParseContext): void {
    if (ctx.char == '>') {
        const value = ctx.text.substr(ctx.start, ctx.pos - ctx.start - 1);
        ctx.snode.content = value;
        ctx.start = ctx.pos + 1;
        ctx.action = content;
    }
    else if (ctx.dchar == '/>') {
        ctx.pos--;
        ctx.action = closeTag;
    }
    else if (ctx.char != ' ') {
        ctx.start = ctx.pos;
        ctx.action = tagName;
    }
}

function openTag(ctx: IParseContext): void {
    if (ctx.char == ' ' || ctx.char == '>' || ctx.dchar == '/>') {
        const tagName = ctx.text.substr(ctx.start, ctx.pos - ctx.start);
        ctx.tags.push(tagName);
        ctx.snode.tag = tagName;
        ctx.start = ctx.pos--;
        ctx.action = tagMiddle;
    }
}

function closeTag(ctx: IParseContext): void {

    const checkOnlyContent = function () {
        if (ctx.snode.childs!.length == 1) {
            const child = ctx.snode.childs![0]!;
            if (child.content && (!child.childs || child.childs.length == 0)) {
                ctx.snode.content = child.content;
                ctx.snode.childs = [];
            }
        }
    }

    if (ctx.char == '>') {
        const tagName = ctx.text.substr(ctx.start, ctx.pos - ctx.start);
        const lastTag = ctx.tags.pop();
        if (lastTag !== tagName) {
            throw 'Invalid close tag!';
        }
        checkOnlyContent();
        ctx.start = ctx.pos + 1;
        ctx.snode = ctx.snode.parent!;
        ctx.action = content;
    }
    else if (ctx.dchar == '/>') {
        ctx.tags.pop();
        checkOnlyContent();
        ctx.pos++;
        ctx.start = ctx.pos + 1;
        ctx.snode = ctx.snode.parent!;
        ctx.action = content;
    }
}

function comment(ctx: IParseContext): void {
    if (ctx.text.substr(ctx.pos, 3) == '-->') {
        ctx.start = ctx.pos + 3;
        ctx.action = ctx.backAction!;
    }
}

function content(ctx: IParseContext): void {

    const setContent = function () {
        const content = ctx.text.substr(ctx.start, ctx.pos - ctx.start);
        if (content.length > 0) {
            ctx.snode.childs!.push({ content })
        }
    }

    if (ctx.pos == ctx.text.length) {
        setContent();
    }
    else if (ctx.text.substr(ctx.pos, 4) == '<!--') {
        ctx.backAction = content;
        ctx.action = comment;
    }
    else if (ctx.dchar == '</') {
        setContent();
        ctx.pos++;
        ctx.start = ctx.pos + 1;
        ctx.action = closeTag;
    }
    else if (ctx.char == '<') {
        setContent();
        ctx.start = ctx.pos + 1;
        ctx.action = openTag;
        const snode: ISNode = {
            childs: [],
            parent: ctx.snode
        };
        ctx.snode.childs!.push(snode);
        ctx.snode = snode;
    }
}

function runPos(ctx: IParseContext): void {
    while (ctx.pos < ctx.text.length) {
        ctx.action(ctx);
        ctx.char = ctx.text[++ctx.pos];
        ctx.dchar = ctx.text.substr(ctx.pos, 2);
    }
    ctx.action(ctx);
}

function parseHtml(html: string): ISNode[] {
    const root: ISNode = {
        childs: []
    };
    const ctx: IParseContext = {
        text: html,
        pos: 0,
        start: 0,
        char: html[0],
        tags: [],
        snode: root,
        action: content
    };
    runPos(ctx);
    return root.childs!;
}

export function buildHtml(html: string): ISNode[] {
    const testparse = parseHtml(html);
    //console.log('testparse', testparse);
    return testparse;
}

