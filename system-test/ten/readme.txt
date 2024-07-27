
colocar loading no selecionar profile e mensagem de não encontrado caso não encontrar


Site de dominios
https://www.dynadot.com/domain/search.html
https://who.is/


Data
    Struct
    View
        Permissions
    Stages
        Actions
            Permissions
    Transictions
        Permissions


DataConstructor(Data, Storage, Business)
    Get()




Permissions
{
    Security
    {

export PermsValue = 0 | 1 | 2;

export interface SecurityActors {
    relationId?: ObjectId;
    groupId?: ObjectId;
    perms: { [action: number]: PermsValue };
}

export interface SecurityEntity extends EntityBase {
    profileId: ObjectId;
    path: string;
    actions: { [identify: string]: SecurityActors };
}
    }


}