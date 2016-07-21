import { Window } from '../window';

function AppViewModel() {
    this.firstName = "Bert";
    this.lastName = "Bertington";
}

document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        ko.applyBindings(new AppViewModel());
    }
}

export class MainWindow extends Window {

}