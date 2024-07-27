// import { Path } from 'webhost-websocket';
// import { ILoaderRequest, ILoaderResponse, ISaleServer, SalePath, SalesModel, SaleFormModel } from '@seven/webshared';
// import { SaleBusiness } from '@seven/commission-control';

// @Path(SalePath)
// export class SaleSHub implements ISaleServer {

//     public constructor(
//         private saleBusiness: SaleBusiness
//     ) {
//     }

//     public async getSalesModel(nickName: string): Promise<SalesModel> {
//         return this.saleBusiness.getSalesModel(nickName);
//     }

//     public loaderSales(request: ILoaderRequest): Promise<ILoaderResponse> {
//         return this.saleBusiness.loaderSales(request);
//     }

//     public getSalesForm(nickName: string, id: string): Promise<SaleFormModel> {
//         return <any>this.saleBusiness.getSalesForm(nickName, id);  //TODO: arrumar forma de remover o any do cast
//     }

//     public async salesSave(nickName: string, request: SaleFormModel): Promise<void> {
//         await this.saleBusiness.salesSave(nickName, request);
//     }

//     public salesDelete(nickName: string, ids: string[]): Promise<void> {
//         return this.saleBusiness.salesDelete(nickName, ids);
//     }
// }
