
@Component({
    template: `
        <n-input type="text" [model]="model.name" [label]="@@NAME" />
        <n-save-btn (click)="save_click()">{{@SAVEUSER}}</n-save-btn>
    `
})
export class UserComponent {

    public constructor(
        public model: Model<UserModel>,
        @Server() private userBusiness: UserBusiness
    ) {
    }

    public async onNavigate(@FromRoute(':id') userId: string) {
        this.model.setValue(await this.userBusiness.get(userId));
    }

    public async save_click() {
        //if (this.model.isValid()) {  faz automaticamente se verificar q o valor é um Model
            this.userBusiness.save(this.model);
        //}
    }
}
