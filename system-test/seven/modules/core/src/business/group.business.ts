import { Assert, ILoaderRequest, ILoaderResponse, ObjectId } from '@seven/framework';
import { CoreDatabase } from '../dataaccess/core.database';
import { GroupEntity, GroupMemberType } from '../entity/group.entity';
import { LocationProfile, PortraitType, ProfileGroupModel, ProfileGroupResolve, ProfileGroupsResolve } from '../model';
import { BusinessClass, BusinessEvent } from './interception/business.decorators';

@BusinessClass()
export class GroupBusiness {

    public constructor(
        private core: CoreDatabase
    ) {
    }

    @BusinessEvent({ locationProfile: true })
    public async resolveProfileGroups(lprofile: LocationProfile): Promise<ProfileGroupsResolve> {
        return {
            name: lprofile.name,
            canEditGroups: true
        }
    }

    @BusinessEvent({ locationProfile: true })
    public async loaderProfileGroups(lprofile: LocationProfile, request: ILoaderRequest) {
        const groupAccess = await this.core.group;
        return await groupAccess.loaderProfileGroups(request, lprofile._id);
    }

    @BusinessEvent({ locationProfile: true })
    public async resolveProfileGroup(lprofile: LocationProfile, groupId: string): Promise<ProfileGroupResolve> {

        if (groupId == 'create') {
            return {
                _id: lprofile._id.toHexString(),
                name: lprofile.name,
                group: {
                    _id: <any>undefined,
                    name: '',
                    portrait: {
                        type: PortraitType.Icon,
                        icon: {
                            icon: 'users',
                            backColor: 'white',
                            borderColor: 'black',
                            foreColor: 'black'
                        }
                    },
                    members: []
                }
            }
        }

        Assert.validObjectId(groupId, 'Grupo inválido!');

        const groupAccess = await this.core.group;
        const mgGroupId = new ObjectId(groupId);
        const group = await groupAccess.getOne(lprofile._id, mgGroupId);
        Assert.mustNotNull(group, 'Grupo não encontrado!');

        const members = await groupAccess.getGroupMembers(lprofile._id, mgGroupId);

        return {
            _id: lprofile._id.toHexString(),
            name: lprofile.name,
            group: {
                _id: group._id.toHexString(),
                name: group.name,
                portrait: group.portrait,
                members
            }
        }
    }

    @BusinessEvent({ locationProfile: true })
    public async saveProfileGroup(lprofile: LocationProfile, model: ProfileGroupModel): Promise<void> {

        const groupAccess = await this.core.group;

        //TODO: consultar se todos membros são validos
        const members = model.members
            .map(m => {
                if (m.type == GroupMemberType.IsRelation) {
                    return {
                        type: GroupMemberType.IsRelation,
                        relationId: new ObjectId(m._id)
                    }
                }
                else {
                    return {
                        type: GroupMemberType.IsGroup,
                        groupId: new ObjectId(m._id)
                    } 
                }
            })

        if (model._id) {
            const groupId = new ObjectId(model._id);
            const group = await groupAccess.getOne(lprofile._id, groupId);
            Assert.mustNotNull(group, 'Grupo inválido id: ' + model._id);

            group.name = model.name;
            group.portrait = model.portrait;
            group.members = members;

            const updateResult = await groupAccess.updateSelf(group);
            Assert.database.updatedOne(updateResult, 'Grupo inválido para salvar!');
        }
        else {
            const group: GroupEntity = {
                _id: <any>undefined,
                profileId: lprofile._id,
                name: model.name,
                portrait: model.portrait,
                members: members
            }

            const insertResult = await groupAccess.insertOne(group);
            Assert.database.insertedOne(insertResult, 'Grupo inválido para salvar!');
        }
    }

    @BusinessEvent({ locationProfile: true })
    public async delete(lprofile: LocationProfile, groupId: string): Promise<void> {
        
        // impedir que o grupo seja deletado se está sendo usado
        // tanto em outro gruop ou em permissões

        const groupAccess = await this.core.group;
        const mgGroupId = new ObjectId(groupId);
        const hasGroup = await groupAccess.findGroupsWithMember(lprofile._id, mgGroupId).hasNext();
        Assert.mustFalse(hasGroup, 'Grupo está sendo usado!');

        await groupAccess.delete(lprofile._id, mgGroupId);
    }
}