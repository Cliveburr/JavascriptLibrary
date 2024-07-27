import { Injectable } from 'providerjs';
import { DataAccess, ObjectId } from '@seven/framework';
import { LoginEntity, LoginType } from '../entity/login.entity';

@Injectable()
export class LoginDataAccess extends DataAccess<LoginEntity> {

    public constructor() {
        super('Login')
    }

    public getByPassword(profileId: ObjectId, password: string) {
        const query = {
            type: LoginType.Password,
            profilePrivateId: profileId,
            password: {
                current: password
            }
        }
        return this.findOne(query);
    }

    // public adminLoginTable(request: ILoaderRequest): Promise<ILoaderResponse> {
    //     return this.loadContent(request, undefined, [{ "$project": {
    //         "type": 1
    //     } }]);
    // }
}