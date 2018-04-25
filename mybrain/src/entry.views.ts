import { ParentEntry } from './component/parent-entry';

export class ViewController {

    private static leftEntries: HTMLElement;
    private static rightEntries: HTMLElement;
    private static topEntries: HTMLElement;
    private static bottomEntries: HTMLElement;
    private static mainEntry: HTMLElement;

    public static start(): void {
        this.setEvents();

        this.getContainers();

        this.printWindow();
    }

    private static setEvents(): void {
        window.addEventListener('resize', this.printWindow);
    }

    private static getContainers(): void {
        this.leftEntries = document.getElementById('leftEntries')!!;
        this.rightEntries = document.getElementById('rightEntries')!!;
        this.leftEntries = document.getElementById('topEntries')!!;
        this.leftEntries = document.getElementById('bottomEntries')!!;
        this.mainEntry = document.getElementById('mainEntry')!!;
    }

    public static printWindow(): void {

        let totalTopEntries = 4;

        // get the width
        let width = document.body.clientWidth;
        // divide by number of parents to show in each row
        let parentWidth = width / totalTopEntries;
        // if the size is bigger than the default parent-entry
        if (parentWidth > (ParentEntry.defaultSize + 20)) {  // 20 = margin
            // set the parent-entry to default
            parentWidth = ParentEntry.defaultSize;
        }
        // else if
            // set the parent-entry to this size

        // add or remove the itens to adjust the new count entry

        // call render on each parent-entry object
        
    }
}