
export class SevenError extends Error {
    
    public setAsSevenError = true;

    public constructor(
        public message: string,
        public redirect?: string
    ) {
        super()

        // if (typeof arg1 == 'string') {
        //     this.message = arg1;
        //     //this.inner = <Error>arg2;

        // }
        // else {
        //     this.message = arg1.message;
        //     //this.inner = arg1;
        // }
    }

    public static isSevenError(error: any): error is SevenError {
        return typeof error.setAsSevenError != 'undefined';
    }
}