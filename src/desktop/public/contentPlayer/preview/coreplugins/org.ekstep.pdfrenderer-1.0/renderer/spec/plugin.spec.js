describe('Pdfrenderer Plugin', function() {
	var manifest, pdfrendererInstance;
    beforeAll(function(callback) {
        org.ekstep.contentrenderer.loadPlugins([{"id":"org.ekstep.pdfrenderer","ver":1,"type":"plugin"}], [], function() {
   			console.log("pdfrenderer plugin is loaded");
            toaster = {};
            //PDFJS = {};
			pdfrendererInstance = org.ekstep.pluginframework.pluginManager.pluginObjs['org.ekstep.pdfrenderer'];
			manifest = org.ekstep.pluginframework.pluginManager.pluginManifests['org.ekstep.pdfrenderer'];
            callback();
		});
    });
    describe("When plugin is initialized", function() {
    	it("It should invoke initLauncher", function() {
            spyOn(pdfrendererInstance, "initLauncher").and.callThrough();
            pdfrendererInstance.initLauncher(manifest);
            expect(pdfrendererInstance.initLauncher).not.toBeUndefined();
            
        });

        it("It should invoke enableOverly", function() {
            spyOn(pdfrendererInstance, "enableOverly").and.callThrough();
            pdfrendererInstance.enableOverly(manifest);
            expect(pdfrendererInstance.enableOverly).not.toBeUndefined();
            
        });

        it("It should invoke onScrollEvents", function() {
            spyOn(pdfrendererInstance, "onScrollEvents").and.callThrough();
            pdfrendererInstance.onScrollEvents(manifest);
            expect(pdfrendererInstance.onScrollEvents).not.toBeUndefined();
            expect(pdfrendererInstance.onScrollEvents).toHaveBeenCalled();
         
        });

        it("It should invoke replay", function() {
            spyOn(pdfrendererInstance, "replay").and.callThrough();
            pdfrendererInstance.replay(manifest);
            expect(pdfrendererInstance.replay).not.toBeUndefined();

        });

        it("It should invoke nextNavigation", function() {
            spyOn(pdfrendererInstance, "nextNavigation").and.callThrough();
            pdfrendererInstance.nextNavigation();
            expect(pdfrendererInstance.nextNavigation).not.toBeUndefined();

        });

        it("It should invoke previousNavigation", function() {
            spyOn(pdfrendererInstance, "previousNavigation").and.callThrough();
            pdfrendererInstance.previousNavigation();
            expect(pdfrendererInstance.previousNavigation).not.toBeUndefined();

        });

        xit("It should trigger click evet on pdf-find", function() {
            spyOnEvent($('#pdf-find'), 'click');
            $('#pdf-find').click();
            expect('click').toHaveBeenTriggeredOn($('#pdf-find'));
        });

        xit("It should trigger click evet on #pdf-prev", function() {
            spyOnEvent($('#pdf-prev'), 'click');
            $('#pdf-prev').click();
            expect('click').toHaveBeenTriggeredOn($('#pdf-prev'));
        });

        xit("It should trigger click evet on #pdf-next", function() {
            spyOnEvent($('#pdf-next'), 'click');
            $('#pdf-next').click();
            expect('click').toHaveBeenTriggeredOn($('#pdf-next'));
        });
        xit("It should trigger click event on download pdf button", function() {
            spyOnEvent($('#download-btn'), 'click');
            $('#download-btn').click();
            expect('click').toHaveBeenTriggeredOn($('#download-btn'));
        });
        xit("It should not show download button", function() {
            spyOn(pdfrendererInstance, "addDownloadButton").and.callThrough();
            pdfrendererInstance.addDownloadButton(undefined, "");
            expect($('#download-btn').length).toEqual(0);
        });
    });
});