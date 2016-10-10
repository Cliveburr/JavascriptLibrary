import { LinkElement } from './linkElement';
import { InputElement } from './inputElement';
import { ButtonElement } from './buttonElement';
import { SpanElement } from './spanElement';
import { ControllerElement } from './controllerElement';
import { ArrayElement } from './arrayElement';
import { ViewElement } from './viewElement'; 

export function RegisterElement(): void {
    document.registerElement('nt-link', LinkElement);
    document.registerElement('nt-input', InputElement);
    document.registerElement('nt-button', ButtonElement);
    document.registerElement('nt-span', SpanElement);
    document.registerElement('nt-controller', ControllerElement);
    document.registerElement('nt-array', ArrayElement);
    document.registerElement('nt-view', ViewElement);
}