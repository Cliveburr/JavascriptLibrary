import { LoaderProfileRelationsModel, ProfileRelationsResolve } from "../model";
import { ILoaderRequest, ILoaderResponse } from "@ten/framework_interface";

export abstract class IRelationService {
    abstract resolveProfileRelations(): Promise<ProfileRelationsResolve>
    abstract loaderProfileRelations(request: ILoaderRequest): Promise<ILoaderResponse<LoaderProfileRelationsModel>>;
    abstract requestRelation(realProfileId: string): Promise<void>;
    abstract acceptRelation(realProfileId: string): Promise<void>;
    abstract cancelRelation(realProfileId: string): Promise<void>;
}