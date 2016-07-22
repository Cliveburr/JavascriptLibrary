import { remote } from 'electron';
const {dialog} = remote;

export class MainController {
    
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



function openFile () {
  dialog.showOpenDialog(function (fileNames) {
  }); 
}