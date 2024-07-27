import { ILoaderContent, ILoaderResponse, ILoaderRequest, ILoaderApi } from "./loadercontent.model";

export class ApiLoader implements ILoaderContent {

    public constructor(
        private api: ILoaderApi
    ) {
    }

    public async get(request: ILoaderRequest): Promise<ILoaderResponse> {
        return this.api(request);
    }
}
