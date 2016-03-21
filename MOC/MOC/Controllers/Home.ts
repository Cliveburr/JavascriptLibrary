import moc = require('../moc/MOC');
import objs = require('../moc/DynamicBulma');

class Home extends moc.ControllerBase {
    public Index(): void {
        var tr = new objs.Layout();

        //var tr = new objs.Form();

        //tr.childs.push(new objs.Input('One Input:'));

        //tr.childs.push(new objs.Input('Two Input:'));

        this.postObject(tr);
    }
}

export = Home;