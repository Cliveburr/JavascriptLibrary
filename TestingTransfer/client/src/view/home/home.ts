import { remote } from 'electron';
//import * as components from '../../components/menu/menu';
import * as components from '../../components/allComponents';
const {dialog} = remote;

//debugger;

components.run();

export class MainController {
    public a = 1;
}

function AppViewModel() {
    this.firstName = "Bert";
    this.lastName = "Bertington";
}

document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        ko.applyBindings(new AppViewModel());
    }
}



window['openFile'] = () => {
  dialog.showOpenDialog(function (fileNames) {
  }); 
}