import { Component, OnInit, ViewChild } from '@angular/core';
import { ILiCollectionModalInput } from '../../../model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LiCollectionComponent } from '../../collection/li-collection.component';
import { BaseModalInputComponent } from './base-modal-input';

@Component({
    selector: 's-li-collection-modal-input',
    templateUrl: 'li-collection-modal-input.component.html',
    styleUrls: ['li-collection-modal-input.component.scss']
})
export class LiCollectionModalInputComponent<V> extends BaseModalInputComponent<V, ILiCollectionModalInput<V>> implements OnInit {

    @ViewChild('modal') public modal: ModalDirective;
    @ViewChild('collection') public collection: LiCollectionComponent<V>;

    private execPromise?: (value: V | undefined) => void;

    public constructor(
    ) {
        super()
    }

    public ngOnInit(): void {
    }

    public show(selected?: V | null | undefined): Promise<V> {
        if (typeof selected !== 'undefined') {
            this.inMeta.collection!.selected = selected == null ? undefined : selected;
        }
        return new Promise<V>((e, r) => {
            this.execPromise = e;
            this.modal.show();
            this.collection.refresh();
        });
    }

    public close(): void {
        this.modal.hide();
    }

    public inSelectItem(item: V): void {
        this.value = item;
        this.modal.hide();
        this.execPromise!(item);
    }

    public inModalHidden(): void {
        if (this.execPromise) {
            this.execPromise(undefined);
        }
    }
}