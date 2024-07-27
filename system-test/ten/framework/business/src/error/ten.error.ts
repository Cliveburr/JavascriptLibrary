
export class TenError extends Error {
    
    public setTenError = true;

    public constructor(
        public message: string,
        public redirect?: string
    ) {
        super()
    }

    public static isTenError(error: any): error is TenError {
        return typeof error.setTenError != 'undefined';
    }
}