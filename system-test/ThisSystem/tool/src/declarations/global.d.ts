
// declare module NodeJS {
//     interface Global {
//         sys: number;
//     }
// }

export {};

declare global {

    interface Employee {
        id: number;
        name: string;
        salary: number;
      }

    const value  = 1;
}
