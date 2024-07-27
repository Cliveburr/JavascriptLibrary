

export class TenError extends Error {
    
    public setTenError = true;
    public redirect?: string;

    public constructor(message?: string) {
        super(message)
    }

    public static isTenError(error: any): error is TenError {
        return typeof error.setTenError != 'undefined';
    }
}
