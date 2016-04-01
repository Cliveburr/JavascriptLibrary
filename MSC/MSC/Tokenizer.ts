
export module Tokenizer {
    export function Process(code: string): IToken[] {
        var scope: ITokenScope = {
            code: code,
            start: 0,
            pos: 0,
            char: '',
            content: '',
            token: null,
            stringchar: null,
            commentEnd: null,
            expectedTokens: [
                Word,
                Separators,
                SeparatorsClose,
                Text,
                Comment
            ],
            lastTokens: null
        };

        var rootTokens: IToken[] = [];
        var ecode = code + "\r\n";
        for (; scope.pos < ecode.length; scope.pos++) {
            scope.char = ecode[scope.pos];
            scope.content += scope.char;

            for (var t = 0, token: ITokenType; token = scope.expectedTokens[t]; t++) {
                if (!token.test(scope))
                    continue;

                var ntoken = new token();

                if (scope.token && scope.token.childs)
                    scope.token.childs.push(ntoken);
                else if (!scope.token)
                    rootTokens.push(ntoken)


                ntoken.start = scope.start;
                ntoken.parent = scope.token;

                ntoken.run(scope);

                scope.start = scope.pos + 1;
                scope.content = '';
                break;
            }

        }

        return rootTokens;
    }

    export function GetContent(token: IToken, code: string): string {
        return code.substr(token.start, token.end - token.start + 1);
    }

    export function TestContent(tokens: IToken[], code: string): void {
        for (var i = 0, t: IToken; t = tokens[i]; i++) {

            (<any>t).content = GetContent(t, code);

            if (t.childs)
                TestContent(t.childs, code);
        }
    }

    export interface ITokenScope {
        code: string;
        start: number;
        pos: number;
        char: string;
        content: string;
        token: IToken;
        expectedTokens: ITokenType[];
        lastTokens: ITokenType[];
        stringchar: string;
        commentEnd: string;
    }

    export interface IToken {
        alias: string;
        childs?: IToken[];
        run(scope: ITokenScope): void;
        parent: IToken;
        start: number;
        end: number;
    }

    export abstract class TokenBase {
        public parent: IToken;
        public start: number;
        public end: number;
    }

    export interface ITokenType {
        new (): IToken;
        test(scope: ITokenScope): boolean;
    }

    export class Word extends TokenBase implements IToken {
        public alias = "word";
        private static rgtest = new RegExp("^\\s*([A-z0-9\\.\\_\\$]+)[^A-z0-9\\.\\_\\$]$");

        public static test(scope: ITokenScope): boolean {
            return Word.rgtest.test(scope.content);
        }

        public run(scope: ITokenScope): void {
            this.end = scope.pos - 1;

            var te = /\s$/.test(scope.content);
            if (!te) {
                scope.pos--;
            }
        }
    }

    export class Separators extends TokenBase implements IToken {
        public alias = "separators";
        private static rgtest = new RegExp("^\\s*([\\{\\(\\<\\[])+$");

        public char: string;
        public childs = [];

        public static test(scope: ITokenScope): boolean {
            return Separators.rgtest.test(scope.content);
        }

        public run(scope: ITokenScope): void {
            this.char = scope.char;
            scope.token = this;
        }
    }

    export class SeparatorsClose extends TokenBase implements IToken {
        public alias = "SeparatorsClose";
        private static rgtest = new RegExp("^\\s*([\\}\\)\\>\\]])+$");

        public char: string;

        public static test(scope: ITokenScope): boolean {
            return SeparatorsClose.rgtest.test(scope.content);
        }

        public run(scope: ITokenScope): void {
            this.char = scope.char;
            var sepClose = '';

            switch ((<Separators>scope.token).char) {
                case '{': sepClose = '}'; break;
                case '(': sepClose = ')'; break;
                case '<': sepClose = '>'; break;
                case '[': sepClose = ']'; break;
            }

            if (scope.char == sepClose) {
                scope.token.end = scope.pos;
                scope.token = scope.token.parent;
            }
        }
    }

    export class Symbols extends TokenBase implements IToken {
        public alias = "symbols";
        private static rgtest = new RegExp("^\\s*[,;:]$");

        public char: string;

        public static test(scope: ITokenScope): boolean {
            return Symbols.rgtest.test(scope.content);
        }

        public run(scope: ITokenScope): void {
            this.end = scope.pos - 1;
            this.char = scope.char;
        }
    }

    export class Text extends TokenBase implements IToken {
        public alias = "text";
        private static rgtest = new RegExp("\\s*([\"']+)$");

        public static test(scope: ITokenScope): boolean {
            return Text.rgtest.test(scope.content);
        }

        public run(scope: ITokenScope) {
            var te = Text.rgtest.exec(scope.content);
            scope.stringchar = te[1];
            scope.lastTokens = scope.expectedTokens;
            scope.expectedTokens = [TextClose];
            scope.token = this;
        }
    }

    export class TextClose extends TokenBase implements IToken {
        public alias = "textClose";

        public static test(scope: ITokenScope): boolean {
            return new RegExp("^.*[^\\\\]" + scope.stringchar + "$").test(scope.content);
        }

        public run(scope: ITokenScope) {
            scope.token.end = scope.pos;
            scope.expectedTokens = scope.lastTokens;
            scope.token = scope.token.parent;
        }
    }

    export class Comment extends TokenBase implements IToken {
        public alias = "comment";
        private static rgTest = new RegExp("(\\/\\/)|(\\/\\*)$");

        public static test(scope: ITokenScope): boolean {
            return Comment.rgTest.test(scope.content);
        }

        public run(scope: ITokenScope) {
            scope.commentEnd = ((scope.content.indexOf("//") > -1) ? "[\\r\\n]$" : "\\*\\/$");
            scope.lastTokens = scope.expectedTokens;
            scope.expectedTokens = [CommentEnd];
            scope.token = this;
        }
    }

    export class CommentEnd extends TokenBase implements IToken {
        public alias = "commentEnd";

        public static test(scope: ITokenScope): boolean {
            return new RegExp(scope.commentEnd).test(scope.content);
        }

        public run(scope: ITokenScope) {
            scope.token.end = scope.pos;
            scope.expectedTokens = scope.lastTokens;
            scope.token = scope.token.parent;
        }
    }
}