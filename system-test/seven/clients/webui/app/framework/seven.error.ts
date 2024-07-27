

export class SevenError extends Error {
    
    public setAsSevenError = true;
    public redirect?: string;

    public constructor(message?: string) {
        super(message)
    }

    public static isSevenError(error: any): error is SevenError {
        return typeof error.setAsSevenError != 'undefined';
    }
}
