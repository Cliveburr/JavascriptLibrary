import { Component } from '@angular/core';
import { IModalInput } from 'app/framework';
import { BaseComponent } from '../../base-component';

@Component({
    template: ''
})
export abstract class BaseModalInputComponent<V, M extends IModalInput> extends BaseComponent<V, M> {

   
}
