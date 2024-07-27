import { SecurityStruct } from '@seven/framework';

// Last Id = 3
export enum CoreSecurityKeys {
    ProfileRead = 0,
    ProfileUpdate = 1,
    GroupRead = 2,
    GroupUpdate = 3
}

export const CoreSecurityDomain: SecurityStruct = {
    profile: {
        read: { key: CoreSecurityKeys.ProfileRead, default: false },
        update: { key: CoreSecurityKeys.ProfileUpdate, default: false }
    },
    group: {
        read: { key: CoreSecurityKeys.GroupRead, default: false },
        update: { key: CoreSecurityKeys.GroupUpdate, default: false }
    }
}