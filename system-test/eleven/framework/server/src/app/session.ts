
export class Session {

    public lastAccess: number;

    public constructor(
        public guid: string
    ) {
        this.lastAccess = Date.now();
    }
}