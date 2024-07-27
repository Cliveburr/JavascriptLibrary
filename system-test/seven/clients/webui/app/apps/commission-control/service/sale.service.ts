import { Injectable } from '@angular/core';
import { BaseService, ILoaderRequest, ILoaderResponse, IPath, WebSocketService } from '../../../framework';
import { SaleFormModel, SalesModel } from '../model';

@Injectable()
export class SaleService {

    private sale: IPath;

    public constructor(
        public base: BaseService,
        webSocketService: WebSocketService
    ) {
        this.sale = webSocketService.openPath('comm.sale');
    }

    public getSalesModel(nickName: string): Promise<SalesModel> { return <any>undefined; }
    public loaderSales(request: ILoaderRequest): Promise<ILoaderResponse> { return <any>undefined; }
    public getSalesForm(nickName: string, id: string): Promise<SaleFormModel> { return <any>undefined; }
    public salesSave(nickName: string, request: SaleFormModel): Promise<void> { return <any>undefined; }
    public salesDelete(nickName: string, ids: string[]): Promise<void> { return <any>undefined; }    
}