// Utilities for working with MongoDB ObjectIds in the frontend

export const isValidObjectId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

export const validateObjectId = (id: string, fieldName: string): void => {
    if (!id) {
        throw new Error(`${fieldName} is required`);
    }
    if (!isValidObjectId(id)) {
        throw new Error(`${fieldName} must be a valid 24-character hex string, got: ${id}`);
    }
};
