
export class ObjectHelper {

    public static resolveNamespace(obj: any, names: string[]) {
        let def = obj;
        for (const name of names) {
            def = def[name];
            if (typeof def == 'undefined') {
                break;
            }
        }
        return def;
    }
}