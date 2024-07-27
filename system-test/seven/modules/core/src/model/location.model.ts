import { ObjectId } from "@seven/framework";

export class LocationPaths {

    public constructor(
        public profile?: string,
        public app?: string
    ) {
    }
}

export interface LocationProfile {
    _id: ObjectId;
    nickName: string;
    name: string;
}