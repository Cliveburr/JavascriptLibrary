import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FRAMEWORK_ALL_DIRECTIVE } from "./directive";
import { BaseService, FRAMEWORK_ALL_SERVICE } from "./service";
import { FRAMEWORK_ALL_COMPONENTS } from './component';
import { FRAMEWORK_ALL_GUARDS } from "./guards";

@NgModule({
    declarations: [
        FRAMEWORK_ALL_COMPONENTS, FRAMEWORK_ALL_DIRECTIVE
    ],
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, RouterModule
    ],
    providers: [
        FRAMEWORK_ALL_SERVICE, FRAMEWORK_ALL_GUARDS
    ],
    exports: [
        FRAMEWORK_ALL_COMPONENTS, FRAMEWORK_ALL_DIRECTIVE
    ]
})
export class FrameworkModule {

    public static forRoot(): ModuleWithProviders<FrameworkModule> {
        return {
          ngModule: FrameworkModule,
          providers: [ BaseService ]
        }
    }
}