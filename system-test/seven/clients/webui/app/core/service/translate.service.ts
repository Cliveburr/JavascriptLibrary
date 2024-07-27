import { Injectable, EventEmitter } from '@angular/core';
import { LanguageType, LanguageStore, LanguageEdit, LanguageGetRequest, LanguageGetResponse,
    LanguageSaveRequest, 
    LanguageSaveResponse}  from '../model';
import { BaseService, IPath, WebSocketService } from '../../framework';

@Injectable()
export class TranslateService {

    private translate: IPath;
    private actual: LanguageStore;
    private stores: LanguageStore[];
    //public edits: { [name: string]: ILanguageEdit };
    private edits: string[];
    private userLanguageSelected: string = 'UserLanguageSelected';

    public onTextsChange: EventEmitter<void> = new EventEmitter<void>();
    public defaultType: LanguageType;
    public types: LanguageType[];

    public constructor(
        private base: BaseService,
        webSocketService: WebSocketService
    ) {
        this.translate = webSocketService.openPath('core.translate');
        this.defaultType = { code: 'en', name: 'English (United States)' };
        this.types = [
            this.defaultType,
            { code: 'pt', name: 'Portuguese (Brazil)' }
        ];
        this.stores = [];
        this.edits = [];
        //this.setDefault();
    }

    public load(): Promise<void> {
        let userLanguage = this.base.store.read<string>(this.userLanguageSelected);
        if (!userLanguage) {
            userLanguage = <string>((<any>window).navigator.language || (<any>window).navigator.browserLanguage || (<any>window).navigator.userLanguage);
        }

        let lang = this.getLanguage(userLanguage);
        if (lang === undefined)
            lang = this.defaultType;

        return this.changeToLang(lang);
    }

    //private setDefault(): void {
    //    let browserLang = (<any>window).navigator.language || (<any>window).navigator.browserLanguage || (<any>window).navigator.userLanguage;
    //    let lang = this.getLanguage(browserLang);
    //    if (lang === undefined)
    //        lang = this.defaultType;
    //    this.changeToLang(lang);
    //}

    private getLanguage(lang: string): LanguageType {
        let has = this.types.filter(t => t.code == lang);

        if (has.length > 0) {
            return has[0];
        }

        if (lang.indexOf('-') > -1) {
            let l = lang.split('-')[0];
            let lhas = this.types.filter(t => t.code == l);
            if (lhas.length > 0) {
                return lhas[0];
            }
        }

        return this.defaultType;
    }

    private changeToLang(lang: LanguageType): Promise<void> {
        let store = this.stores.filter(s => s.type.code == lang.code);

        if (store.length > 0) {
            this.actual = store[0];
            this.onTextsChange.emit();
            return Promise.resolve();
        }
        else {
            return this.loadTexts(lang.code)
                .then(response => {
                    let store: LanguageStore = { type: lang, texts: response.texts };
                    this.stores.push(store);
                    this.actual = store;
                    this.base.store.save(this.userLanguageSelected, lang.code);
                    this.onTextsChange.emit();
                });
        }
    }

    private loadTexts(code: string): Promise<LanguageGetResponse> {
        let request: LanguageGetRequest = {
            app: 'web',
            module: 'main',
            code: code
        };

        return this.translate.call('getTexts', request);
    }

    public get currentLanguage(): string {
        let language: string;
        if (this.actual !== undefined) {
            language = this.actual.type.name;
        } else {
            language = "Language";
        }
        return language;
    }

    public changeLang(lang: LanguageType): void {
        //let lang = this.getLanguage(lang);
        this.changeToLang(lang);
    }

    public makeFullName(name: string, pathName: string): string {
        if (name[0] == '@') {
            return name.substr(1);
        }
        else {
            return pathName ?
                pathName + '.' + name :
                name;
        }
    }

    public parse(fullName: string, ...args: any[]): string {
        let text = this.getText(fullName);

        if (!text) {
            return text;
        }

        // do args stuff

        return text;
    }

    private getText(name: string, toEdit: boolean = false): string {
        if (!this.actual) {
            return toEdit ? '': name;
        }

        let names = name.split(".");
        let obj = this.actual.texts;

        for (let n of names) {
            if (obj[n]) {
                obj = obj[n];
            }
            else {
                return toEdit ? '' : name; //'!NOT.EXISTS!';
            }
        }

        if (typeof obj !== 'string') {
            return '!INVALID.OBJECT!';
        }
        else {
            return obj;
        }
    }

    public setEdit(name: string): void {
        let has = this.edits.indexOf(name);
        if (has == -1) {
            this.edits.push(name);
        }
    }

    public removeEdit(name: string): void {
        let has = this.edits.indexOf(name);
        if (has > -1) {
            this.edits.splice(has, 1);
        }
    }

    public getEdit(): LanguageEdit[] {
        let edits: LanguageEdit[] = [];
        for (let e of this.edits) {
            edits.push({
                name: e,
                value: this.getText(e, true)
            });
        }
        return edits;
    }

    public saveEdit(edits: LanguageEdit[]): Promise<void> {
        let changed: LanguageEdit[] = [];

        for (let edit of edits) {
            let text = this.getText(edit.name, true);
            if (text !== edit.value) {
                changed.push(edit);
            }
        }

        let request: LanguageSaveRequest = {
            app: 'web',
            module: 'main',
            code: this.actual.type.code,
            changed: changed
        };

        return this.translate.call<LanguageSaveResponse>('saveTexts', request)
            .then(response => {
                this.actual.texts = response.texts;
                this.onTextsChange.emit();
            });
    }
}