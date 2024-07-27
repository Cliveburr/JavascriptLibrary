import { Assert } from "@seven/framework";
import { Injectable } from "providerjs";
import { CoreDatabase } from "../dataaccess/core.database";
import { LocationProfile } from "../model";

@Injectable()
export class LocationBusiness {

    public constructor(
        private core: CoreDatabase
    ) {
    }

    public async getLocationProfile(profile?: string): Promise<LocationProfile> {
        
        const profileAccess = await this.core.profile;
        const locationProfile = await profileAccess.getLocationProfile(profile);
        Assert.mustNotNull(locationProfile, `Profile ${profile} doest exist!`);

        return locationProfile;
    }
}