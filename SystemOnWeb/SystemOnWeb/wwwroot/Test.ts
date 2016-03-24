
module Test {

    export var engine = new MetalEngine.Engine();

    Sow.subscribe('sow.complete', () => {
        var renderer = new MetalEngine.CanvasRenderer();
        renderer.attach(window.document.body);
        engine.setRenderer(renderer);
    });

    Sow.subscribe('me.input.ev', (data: MetalEngine.IInputData) => {
        if (data.source == 'keyboard') {
            var keyData = data as MetalEngine.IKeyboardData;
            console.log(keyData.ev.char);
        }
    });
}