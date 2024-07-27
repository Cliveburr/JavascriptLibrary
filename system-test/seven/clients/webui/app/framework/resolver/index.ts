export * from './model-id.resolver';
//export * from './table.resolver';
export * from './generic.resolver';

//import { ModelIdResolver } from './model-id.resolver';
//import { TableResolver } from './table.resolver';
import { /*GenericResolver,*/ ProfileResolver } from './generic.resolver';
export const FRAMEWORK_ALL_RESOLVER = [
    //ModelIdResolver,
    //TableResolver,
    //GenericResolver,
    ProfileResolver
]