import { ILoaderModel, ILoaderContent } from '../model';
import { StaticLoader, ApiLoader } from '../service';

export function buildLoader(model: ILoaderModel): ILoaderContent {
    if (model.staticItems) {
        return new StaticLoader(model.staticItems);
    }
    else if (model.apiItems) {
        return new ApiLoader(model.apiItems);
    }
    else {
        console.error('!Invalid loader content!', model);
        throw 'Invalid loader content!';
    }
}
