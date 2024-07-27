import { DataAccess, ObjectId } from "@ten/framework_business";
import { Injectable } from "providerjs";
import { LoginEntity, LoginType } from "../entity";

@Injectable()
export class LoginDataAccess extends DataAccess<LoginEntity> {
    
    public constructor() {
        super('Login')
    }

    public getPassword(profileId: ObjectId) {
        const query = {
            type: LoginType.Password,
            profilePrivateId: profileId
        }
        return this.findOne(query);
    }
}