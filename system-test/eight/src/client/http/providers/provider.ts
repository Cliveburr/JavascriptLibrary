
export interface IProvider<T> {
    resolve(key: any): Promise<T | undefined>;
}

export class Provider<T> {

    public constructor(
        public providers: IProvider<T>[]
    ) {
    }

    public async get(key: any): Promise<T | undefined> {
        for (const provider of this.providers) {
            const resolved = await provider.resolve(key);
            if (resolved) {
                return resolved;
            }
        }
        return undefined;
    }
}