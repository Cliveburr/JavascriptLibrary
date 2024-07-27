import { IRelationService, ProfileRelationsResolve, RelationState } from "@ten/core_interface";
import { Assert, BusinessCallContext, BusinessClass, BusinessEvent, ObjectId } from "@ten/framework_business";
import { ILoaderRequest } from "@ten/framework_interface";
import { ProfileDataAccess, RelationDataAccess } from "../dataaccess";
import { RelationEntity, RelationType } from "../entity";
import { SecurityService } from "./security.service";

@BusinessClass()
export class RelationBusiness extends IRelationService {

    public constructor(
        private context: BusinessCallContext,
        private profileAccess: ProfileDataAccess,
        private relationAccess: RelationDataAccess,
        private securityService: SecurityService
    ) {
        super()
    }

    @BusinessEvent({ security: 'core.relation.read' })
    public async resolveProfileRelations(): Promise<ProfileRelationsResolve> {

        const profile = await this.profileAccess.getByNickName(this.context.locationProfile);
        Assert.mustNotNull(profile, 'Perfil não encontrado!');

        return {
            name: profile.name,
            canSecurity: await this.securityService.checkAuthorized('core.relation.security', this.context),
            canEdit: await this.securityService.checkAuthorized('core.relation.edit', this.context)
        }
    }

    @BusinessEvent({ security: 'core.relation.read' })
    public loaderProfileRelations(request: ILoaderRequest) {
        return this.relationAccess.loaderProfileRelations(request, this.context.sessionProfileId!);
    }

    @BusinessEvent({ security: 'core.relation.edit' })
    public async requestRelation(realProfileId: string): Promise<void> {

        const locationProfile = await this.profileAccess.getByNickName(this.context.locationProfile);
        Assert.mustNotNull(locationProfile, 'Perfil não encontrado!');

        const realObjectId = new ObjectId(realProfileId);

        const hasRelation = await this.relationAccess.getReal(locationProfile._id, realObjectId);
        if (hasRelation) {
            switch (hasRelation.state) {
                case RelationState.Established:
                    throw 'Relation already been established!';
                case RelationState.Requested:
                    throw 'Relation already been requested!';
                case RelationState.ToAccept:
                    throw 'Relation was requested and waiting for you to accept!';
                default:
                    this.updateOldRelation(hasRelation);
            }
        }
        else {
            this.createNewRelation(locationProfile._id, realObjectId);
        }
    }

    private async createNewRelation(locationProfileId: ObjectId, realObjectId: ObjectId): Promise<void> {

        const meToRelation: RelationEntity = {
            _id: <any>undefined,
            profileId: locationProfileId,
            type: RelationType.Real,
            state: RelationState.Requested,
            realProfileId: realObjectId,
            history: [
                { state: RelationState.Requested, date: new Date(Date.now()) }
            ]
        }
        const relationToMe: RelationEntity = {
            _id: <any>undefined,
            profileId: realObjectId,
            type: RelationType.Real,
            state: RelationState.ToAccept,
            realProfileId: locationProfileId,
            history: [
                { state: RelationState.ToAccept, date: new Date(Date.now()) }
            ]
        }

        const result = await this.relationAccess.insertMany(meToRelation, relationToMe);
        Assert.database.insertedMany(result, 2, 'Error creating relation!');
    }

    private async updateOldRelation(relation: RelationEntity): Promise<void> {

        const updateResult = await this.relationAccess.updateRelation(relation.profileId, relation.realProfileId, RelationState.Canceled, RelationState.Requested);
        Assert.database.updatedOne(updateResult, 'Invalid re-stablish this relation!');

        const updateForResult = await this.relationAccess.updateRelation(relation.realProfileId, relation.profileId, RelationState.Canceled, RelationState.ToAccept);
        Assert.database.updatedOne(updateForResult, 'Invalid re-stablish this relation!');
    }

    @BusinessEvent({ security: 'core.relation.edit' })
    public async acceptRelation(realProfileId: string): Promise<void> {

        const locationProfile = await this.profileAccess.getByNickName(this.context.locationProfile);
        Assert.mustNotNull(locationProfile, 'Perfil não encontrado!');
        
        const realObjectId = new ObjectId(realProfileId);

        const updateResult = await this.relationAccess.updateRelation(locationProfile._id, realObjectId, RelationState.ToAccept, RelationState.Established);
        Assert.database.updatedOne(updateResult, 'Invalid relation to accept!');

        const updateForResult = await this.relationAccess.updateRelation(realObjectId, locationProfile._id, RelationState.Requested, RelationState.Established);
        Assert.database.updatedOne(updateForResult, 'Invalid relation to accept!');
    }

    @BusinessEvent({ security: 'core.relation.edit' })
    public async cancelRelation(realProfileId: string): Promise<void> {

        const locationProfile = await this.profileAccess.getByNickName(this.context.locationProfile);
        Assert.mustNotNull(locationProfile, 'Perfil não encontrado!');

        const realObjectId = new ObjectId(realProfileId);

        const updateResult = await this.relationAccess.updateRelation(locationProfile._id, realObjectId,
            [RelationState.ToAccept, RelationState.Requested, RelationState.Established], RelationState.Canceled);
        Assert.database.updatedOne(updateResult, 'Invalid relation to cancel!');

        const updateForResult = await this.relationAccess.updateRelation(realObjectId, locationProfile._id, 
            [RelationState.ToAccept, RelationState.Requested, RelationState.Established], RelationState.Canceled);
        Assert.database.updatedOne(updateForResult, 'Invalid relation to cancel!');

        //TODO: in future, schedule too test if is possible to hard delete the relations
    }
}