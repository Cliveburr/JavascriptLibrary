import { Component } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { sha256 } from 'js-sha256';
import { CreatePrivateWithPasswordRequest, IProfileService } from 'src/core';
import { BaseService, IValidatorsFunc } from 'src/framework';

@Component({
    templateUrl: './register.component.html'
})
export class ProfileRegisterComponent {

    public model: CreatePrivateWithPasswordRequest;
    public confirmPassword: string;

    public nickNameKey: IValidatorsFunc = { key: 'nickValidator', asyncValidator: this.nickNameKeyValidator.bind(this) };
    public passwordComplex: IValidatorsFunc = { key: 'password', validator: this.passwordComplexVerify.bind(this) };
    public passowrdEqual: IValidatorsFunc = { key: 'passwordEqual', validator: this.passwordEqualVerify.bind(this) };

    public constructor(
        private base: BaseService,
        private profileService: IProfileService
    ) {
        this.confirmPassword = '';
        this.model = <any>{};
    }

    public async registerAccount(): Promise<void> {

        const securityPass = sha256.hex(this.model.password);
        const securityModel = {
            fullName: this.model.fullName,
            nickName: this.model.nickName,
            email: this.model.email,
            password: securityPass
        }

        await this.base.withLoadingNavNotify(
            this.profileService.createPrivateWithPassword(securityModel),
            'Conta criada com sucesso! Faça o login!',
            '/login'
        );
    }

    public async nickNameKeyValidator(control: AbstractControl): Promise<{ nickValidator: string } | null> {
        if (control.value) {
            const check = await this.profileService.validedNickName(control.value);
            if (check) {
                return { nickValidator: check };
            }
        }
        return null;
    }

    public passwordComplexVerify(control: AbstractControl): { password: string } | null {
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
        return null;
    }

    public passwordEqualVerify(control: AbstractControl): { passwordEqual: string } | null {
        const pass = control.value as string;
        if (!pass || pass != this.model.password) {
            return { passwordEqual: 'Confirme a senha corretamente!' }
        }
        return null;
    }
}
