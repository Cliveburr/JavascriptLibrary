
export class GlobalId {

    public static chars = 'asdfghjklqwertyuiopzxcvbnmASDFGHJKLQWERTYUIOPZXCVBNM';
    public static charsLen = GlobalId.chars.length;
    public static count: number = 0;

    public static generateNewId(): string {
        let id = '';
        let va = GlobalId.count++;
        while (va >= GlobalId.charsLen) {
            const i = va % GlobalId.charsLen;
            id += GlobalId.chars[i];
            va = Math.floor(va / GlobalId.charsLen - 1);
        }
        id += GlobalId.chars[va];
        return id;
    }
}