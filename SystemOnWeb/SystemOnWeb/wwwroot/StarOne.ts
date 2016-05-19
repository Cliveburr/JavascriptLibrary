
module StarOne {

    export var engine = new MetalEngine.Engine();

    var start = () => {
        var renderer = new MetalEngine.CanvasRenderer();
        renderer.attach(window.document.body);
        engine.setRenderer(renderer);

        //var game = new Game();
        //game.spawPlayer();
    }

    Sow.subscribe('sow.complete', start);
}