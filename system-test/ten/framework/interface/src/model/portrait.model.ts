
export enum PortraitType {
    TwoLetter = 0,
    Icon = 1
}

export interface TwoLetterPortrait {
    twoLetter: string;
    borderColor: string;
    backColor: string;
    foreColor: string;
}

export interface IconPortrait {
    icon: string;
    borderColor: string;
    backColor: string;
    foreColor: string;
}

export interface PortraitModel {
    type: PortraitType;
    twoLetter?: TwoLetterPortrait;
    icon?: IconPortrait;
}