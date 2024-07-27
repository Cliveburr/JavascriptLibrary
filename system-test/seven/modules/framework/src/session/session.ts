import { Injectable } from 'providerjs';
import { ObjectId } from 'mongodb';

let sessionId = 0;

@Injectable()
export class Session {

    public sessionId = sessionId++;

    public profileId: ObjectId;

    public appInstanceId: { [code: number]: 'false' | undefined | ObjectId } = {};

}
