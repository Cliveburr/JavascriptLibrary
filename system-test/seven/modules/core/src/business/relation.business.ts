import { CoreDatabase } from '../dataaccess/core.database';
import { ProfileType } from '../entity/profile.entity';
import { SevenError, ILoaderRequest, ILoaderResponse, Session, ObjectId, Assert } from '@seven/framework';
import { RelationEntity, RelationType, RelationState } from '../entity/relation.entity';
import { ProfileRelationsResolve, RelationOutResolve, LocationProfile, RelationOutModel, PortraitType } from '../model';
import { BusinessClass, BusinessEvent } from './interception/business.decorators';

@BusinessClass()
export class RelationBusiness {

    public constructor(
        private core: CoreDatabase,
        private session: Session,
    ) {
    }

    @BusinessEvent()
    public async requestRelation(realProfileId: string): Promise<void> {

        const relationAccess = await this.core.relation;
        const realObjectId = new ObjectId(realProfileId);

        const hasRelation = await relationAccess.getReal(this.session.profileId, realObjectId);
        if (hasRelation) {
            switch (hasRelation.state) {
                case RelationState.Established:
                    throw new SevenError('Relation already been established!');
                case RelationState.Requested:
                    throw new SevenError('Relation already been requested!');
                case RelationState.ToAccept:
                    throw new SevenError('Relation was requested and waiting for you to accept!');
                default:
                    this.updateOldRelation(hasRelation);
            }
        }
        else {
            this.createNewRelation(realObjectId);
        }
    }

    private async createNewRelation(realObjectId: ObjectId): Promise<void> {

        const relationAccess = await this.core.relation;

        const meToRelation: RelationEntity = {
            _id: <any>undefined,
            profileId: this.session.profileId,
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
            realProfileId: this.session.profileId,
            history: [
                { state: RelationState.ToAccept, date: new Date(Date.now()) }
            ]
        }

        const result = await relationAccess.insertMany(meToRelation, relationToMe);
        Assert.database.insertedMany(result, 2, 'Error creating relation!');
    }

    private async updateOldRelation(relation: RelationEntity): Promise<void> {

        const relationAccess = await this.core.relation;

        const updateResult = await relationAccess.updateRelation(relation.profileId, relation.realProfileId, RelationState.Canceled, RelationState.Requested);
        Assert.database.updatedOne(updateResult, 'Invalid re-stablish this relation!');

        const updateForResult = await relationAccess.updateRelation(relation.realProfileId, relation.profileId, RelationState.Canceled, RelationState.ToAccept);
        Assert.database.updatedOne(updateForResult, 'Invalid re-stablish this relation!');
    }

    @BusinessEvent({ locationProfile: true })
    public async resolveProfileRelations(lprofile: LocationProfile): Promise<ProfileRelationsResolve> {
        return {
            name: lprofile.name,
            canEditRelations: true
        }
    }

    @BusinessEvent({ locationProfile: true })
    public async loaderProfileRelations(lprofile: LocationProfile, request: ILoaderRequest) {
        const relationAccess = await this.core.relation;
        return await relationAccess.loaderProfileRelations(request, lprofile._id);
    }

    @BusinessEvent({ locationProfile: true })
    public async acceptRelation(lprofile: LocationProfile, realProfileId: string): Promise<void> {

        const relationAccess = await this.core.relation;
        const realObjectId = new ObjectId(realProfileId);

        const updateResult = await relationAccess.updateRelation(lprofile._id, realObjectId, RelationState.ToAccept, RelationState.Established);
        Assert.database.updatedOne(updateResult, 'Invalid relation to accept!');

        const updateForResult = await relationAccess.updateRelation(realObjectId, lprofile._id, RelationState.Requested, RelationState.Established);
        Assert.database.updatedOne(updateForResult, 'Invalid relation to accept!');
    }

    @BusinessEvent({ locationProfile: true })
    public async cancelRelation(lprofile: LocationProfile, realProfileId: string): Promise<void> {

        const relationAccess = await this.core.relation;
        const realObjectId = new ObjectId(realProfileId);

        const updateResult = await relationAccess.updateRelation(lprofile._id, realObjectId,
            [RelationState.ToAccept, RelationState.Requested, RelationState.Established], RelationState.Canceled);
        Assert.database.updatedOne(updateResult, 'Invalid relation to cancel!');

        const updateForResult = await relationAccess.updateRelation(realObjectId, lprofile._id, 
            [RelationState.ToAccept, RelationState.Requested, RelationState.Established], RelationState.Canceled);
        Assert.database.updatedOne(updateForResult, 'Invalid relation to cancel!');

        //TODO: in future, schedule too test if is possible to hard delete the relations
    }

    @BusinessEvent({ locationProfile: true })
    public async resolveProfileRelation(lprofile: LocationProfile, relationId: string): Promise<RelationOutResolve> {

        if (relationId == 'create') {
            return {
                name: lprofile.name,
                relation: {
                    _id: <any>undefined,
                    name: '',
                    email: '',
                    active: true
                }
            }
        }

        Assert.validObjectId(relationId, 'Relação inválida!');

        const relationAccess = await this.core.relation;
        const outObjectId = new ObjectId(relationId);
        const relation = await relationAccess.getOut(lprofile._id, outObjectId);
        Assert.mustNotNull(relation, 'Relation not found!');

        return {
            name: lprofile.name,
            relation: {
                _id: relation._id.toHexString(),
                name: relation.outProfile!.name,
                email: relation.outProfile!.email,
                active: relation.state == RelationState.Established
            }
        }
    }

    @BusinessEvent({ locationProfile: true })
    public async saveProfileRelation(lprofile: LocationProfile, model: RelationOutModel): Promise<void> {
        
        const relationAccess = await this.core.relation;
        
        if (model._id) {
            const outObjectId = new ObjectId(model._id);
            const relation = await relationAccess.getOut(lprofile._id, outObjectId);
            Assert.mustNotNull(relation, 'Invalid relation id: ' + model._id);

            relation.outProfile!.name = model.name;
            relation.outProfile!.email = model.email;
            relation.state = model.active ? RelationState.Established : RelationState.ToAccept;

            const updateResult = await relationAccess.updateSelf(relation);
            Assert.database.updatedOne(updateResult, 'Invalid relation to save!');
        }
        else {
            const relation = <RelationEntity>{
                _id: <any>undefined,
                profileId: lprofile._id,
                type: RelationType.Out,
                state: model.active ? RelationState.Established : RelationState.ToAccept,
                //history: [{ state: RelationState.Established, date: new Date(Date.now()) }],
                outProfile: {
                    name: model.name,
                    type: ProfileType.Private,
                    email: model.email,
                    portrait: {
                        type: PortraitType.TwoLetter,
                        twoLetter: {
                            twoLetter: model.name.substr(0, 2),
                            backColor: 'light',
                            borderColor: 'secondary',
                            foreColor: 'primary'
                        }
                    }
                }
            }

            const insertResult = await relationAccess.insertOne(relation);
            Assert.database.insertedOne(insertResult, 'Invalid relation to save!');
        }
    }

    @BusinessEvent({ locationProfile: true })
    public async relationProfileSelect(lprofile: LocationProfile, request: ILoaderRequest) {
        const relationAccess = await this.core.relation;
        return await relationAccess.relationProfileSelect(request, lprofile._id);
    }
}