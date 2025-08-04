// Utilities for working with MongoDB ObjectIds in the frontend

export const isValidObjectId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};
