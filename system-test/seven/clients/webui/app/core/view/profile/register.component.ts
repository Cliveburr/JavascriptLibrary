import { Component } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ProfileRegisterModel } from 'app/core/model';
import { ITextInput, NotifyType } from '../../../framework';
import { ProfileService } from '../../service';

@Component({
    templateUrl: './register.component.html'
})
export class ProfileRegisterComponent {

    public model: ProfileRegisterModel;
    public formGroup: FormGroup;
    public confirmPassword: string;

    public nickNameKey = { key: 'nickValidator', asyncValidator: this.nickNameKeyValidator.bind(this) };
    public passwordComplex = { key: 'password', validator: this.passwordComplexVerify.bind(this) };
    public passowrdEqual = { key: 'passwordEqual', validator: this.passwordEqualVerify.bind(this) };

    public constructor(
        private profileService: ProfileService
    ) {
        this.formGroup = new FormGroup({});
        this.model = <any>{};
    }

    public async registerAccount(): Promise<void> {

        this.formGroup.markAllAsTouched();
        if (this.formGroup.invalid) {
            return;
        }

        await this.profileService.base.withLoadingNavNotify(
            this.profileService.createProfile(this.model),
            'Conta criada com sucesso! Faça o login!',
            '/login'
        );
    }

    public async nickNameKeyValidator(control: AbstractControl): Promise<{ nickValidator: string } | undefined> {
        if (control.value) {
            const check = await this.profileService.validedNickName(control.value);
            if (check) {
                return { nickValidator: check };
            }
        }
        return undefined;
    }

    public passwordComplexVerify(control: AbstractControl): { password: string } | undefined {
        this.confirmPassword = '';
        const pass = control.value as string;
        if (pass) {
            if (pass.length < 3) {
                return { password: 'Senha muito curta! Entre uma senha de 3 a 15 letras!' }
            }
            if (pass.length > 15) {
                return { password: 'Senha muito grande! Entre uma senha de 3 a 15 letras!' }
            }
        }
        return undefined;
    }

    public passwordEqualVerify(control: AbstractControl): { passwordEqual: string } | undefined {
        const pass = control.value as string;
        if (!pass || pass != this.model.password) {
            return { passwordEqual: 'Confirme a senha corretamente!' }
        }
        return undefined;
    }
}
