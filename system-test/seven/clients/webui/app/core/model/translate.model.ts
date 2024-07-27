

export interface LanguageType {
    code: string;
    name: string;
}

export interface LanguageStore {
    type: LanguageType;
    texts: any;
}

export interface LanguageEdit {
    name: string;
    value: string;
}

export interface LanguageGetRequest {
    app: string;
    code: string;
    module: string;
}

export interface LanguageGetResponse {
    texts: any;
}

export interface LanguageSaveRequest {
    app: string;
    code: string;
    module: string;
    changed: LanguageEdit[];
}

export interface LanguageSaveResponse {
    texts: any;
}