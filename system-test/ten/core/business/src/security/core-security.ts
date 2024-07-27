import { SecurityModel } from "@ten/framework_business";

// Last Id = 11
export const CoreSecurityDomain: SecurityModel = {
    home: {
        read: { key: 0, default: false },
        security: { key: 1, default: false }
    },
    profile: {
        read: { key: 2, default: false },
        update: { key: 3, default: false },
        security: { key: 4, default: false }
    },
    group: {
        read: { key: 6, default: false },
        update: { key: 7, default: false },
        security: { key: 8, default: false }
    },
    relation: {
        read: { key: 9, default: false },
        update: { key: 10, default: false },
        security: { key: 11, default: false }
    },
}