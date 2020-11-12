describe('Overlay Plugin', function() {
	var manifest, OverlayPluginInstance;
    beforeAll(function(callback) {
        var div = document.createElement('div');
        div.id = 'overlay';
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(div);
        org.ekstep.contentrenderer.loadPlugins([{"id":"org.ekstep.overlay","ver":1,"type":"plugin"}], [], function() {
			OverlayPluginInstance = org.ekstep.pluginframework.pluginManager.pluginObjs['org.ekstep.overlay'];
			manifest = org.ekstep.pluginframework.pluginManager.pluginManifests['org.ekstep.overlay'];
            callback();
		});
    });
    describe("When plugin is initialized", function() {
    	it("It should load overlay controller & templates", function() {
            expect(EkstepRendererAPI).not.toBeUndefined();
            var ngController = org.ekstep.service.controller;
            spyOn(ngController, "loadNgModules").and.callThrough();
            OverlayPluginInstance.initialize();
            expect(OverlayPluginInstance._templatePath).not.toBeUndefined();
            expect(OverlayPluginInstance.controllerPath).not.toBeUndefined();
            expect(OverlayPluginInstance._menuTP).not.toBeUndefined();
            expect(ngController.loadNgModules).toHaveBeenCalled();
        })
        it("It should register events", function() {
            expect(EventBus.hasEventListener('render:overlay:applyStyles')).toBe(true);
            expect(EventBus.hasEventListener('renderer:content:start')).toBe(true);
            expect(EventBus.hasEventListener('renderer:overlay:show')).toBe(true);
        });
    });
    describe("When showOrHideOverlay is called", function() {
        it("It should show overlay", function() {
            OverlayPluginInstance.showOrHideOverlay();
            expect(OverlayPluginInstance.overlayVisible).toBeTruthy();
        })
    });
    describe("When renderer styles is resizing", function() {
        it("It should resize renderer if gamearea is greater than 16:9 ratio", function(done) {
            OverlayPluginInstance.updateRendererStyles();
            var gameArea = document.getElementById("overlay");
            setTimeout(function(){
                expect(gameArea.style.left).toEqual('50%');
                expect(gameArea.style.top).toEqual('50%');
                done();
            }, 100);
        })
        it("It should resize renderer if gamearea is less than 16:9 ratio", function(done) {
            window.innerHeight = 1858;
            window.innerWidth = 399;
            OverlayPluginInstance.updateRendererStyles();
            var gameArea = document.getElementById("overlay");
            setTimeout(function(){
                expect(gameArea.style.left).toEqual('50%');
                expect(gameArea.style.top).toEqual('50%');
                done();
            }, 100);
        })
    });
    describe("When applyStyles is called", function() {
        xit("It should change element style", function() {
            var gameArea = document.getElementById("overlay");
            OverlayPluginInstance.applyStyles(gameArea, 'width', '500px');
            expect(gameArea.style.width).toEqual('500px');
        });
    });
});