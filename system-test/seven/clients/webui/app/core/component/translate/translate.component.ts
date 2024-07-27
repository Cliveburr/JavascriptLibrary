import { Component } from '@angular/core';
import { TranslatePathService } from '../../service/translate-path.service';
//import { TranslateService, LanguageEdit } from './translate.service';
//import { StaticModalComponent } from '../component/modal/static-modal.component';

@Component({
    selector: 'translate-edit',
    templateUrl: 'translate.component.html',
    //providers: [TranslatePathService.forPath('TRANSLATE')]
})
export class TranslateComponent {

    // @ViewChild('editorModal') public editorModal: StaticModalComponent;

    // public edits: LanguageEdit[];

    // public constructor(
    //     private service: TranslateService
    // ) {
    // }

    // public showEditor(): void {
    //     this.edits = this.service.getEdit();
    //     this.editorModal.show()
    // }

    // public save(): void {
    //     this.service.saveEdit(this.edits)
    //         .then(() => this.editorModal.hide());
    // }
}