
// Element
class Div implements Element {
	public tag = 'DIV';
	public childs = new ElementChilds();
	
	constructor(childs?: IElementChilds) {
		this.childs.set(childs);
	}
}

class Label implements Element {
	public tag = 'LABEL';
	public html = new ElementProperty('innerHTML');
	
	constructor(text: string) {
		this.html.set(text);
	}
}

class Input implements Element {
	public tag = 'INPUT';
	public value = new ElementProperty('value');
	public onclick = new ElementEvent('onclick');

	constructor(text: string, onclick: Function) {
		this.value.set(text);
		this.onclick.add(onclick);
	}
}

let label = new Label('Hello World');
var input = new Input('Change the World', () => {
	label.html.set('World Changed!');
});
let div = new Div([label, input]);
Tagger.insert(div, document.body);

<div>
	<label name="label">Hello World</label>
	<input name="input" value="Change the World" />
</div>
<script>
	var label = document.getElementByName('label');
	var input = document.getElementByName('input');
	input.onclick = function() {
		label.innerHTML = 'World Changed!';
	};
</script>


// Component
class MyButton {
	//public tag = 'MY_BUTTON';
	public text = new Watcher();
	
	private _label: Label;
	
	constructor(text: string) {
		this.text.set(text);
		this.text.add((value, old) => {
			this._label.html.set(value);
		});
	}
	
	public elements(): IElementChilds {
		this._label = new Label(this.text.value());
		let input = new Input(this.text.value(), () => this.text.set(input.value.value()));
		input.type = Input.Type.Text;
		return new Div([this._label, input]);
	}
}

let mybutton = new MyButton('type here');
Tagger.insert(mybutton, document.body);

<div>
	<label name="label">type here</label>
	<input name="input" type="text" value="type here" />
</div>
<script>
	var label = document.getElementByName('label');
	var input = document.getElementByName('input');
	input.onkeydown = function() {
		label.innerHTML = input.value;
	};
</script>






// Simple bind
<div>
	<p>@HelloWorld</p>
</div>

class App {
	public HelloWorld = 'Hello world!!!';
}

Tagger.bootstrap(App);

// Simple event

<div>
	<label>@Value</label>
	<input value="@Value" />
</div>

class Input implements IElement {
	private _value: Watcher;
	public value = new ElementProperty('value');
	
	public initialize(props: IPropertyCollection) {
		if (props.has('value')) {
			let value = props.get('value');
			if (vari = Tagger.bind.test(value, this)) {
				this._value = bind;
				this.value.link(bind);
			}
		}
	}
}

class App implements Tagger.IScope {
	public scope = 'app';
	public Value = 'Hello world...';
}

Tagger.bootstrap(App);

Scope Tree

quando o valor de um watcher é um watcher, eles se linkam

// Simple Component

class MyButton implements IScope, IComponent {
	public scope = 'mybutton';
	public template = '<div>
	<label>@text</label>
	<input type="text" value="@value" />
</div>
	
	public text = new ElementAttribute('text');
	public value = new ElementAttribute('value');
	
	public initialize(props: IPropertyCollection) {
		if (props.has('text')) {
			let text = props.get('text');
			if (vari = Tagger.bind.test(text, this)) {
				this._value = bind;
				this.value.link(bind);
			}
		}
	}
}

<mybutton text="Type here" value="@Value" />

// Simple Function

@ = significa, usar watcher do scopo
@@ = significa, usar watcher do scopo, iniciando pela raiz

class Translate implements IFunction {
	public exec(map: string): void {
		
	}
}

<div>@@translate('helloMsg')</div>



<div scope="app" model="teste"></div>