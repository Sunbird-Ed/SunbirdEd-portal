describe('Sunbird user switch Plugin', function() {
	var manifest, userSwitcherInstance;
    beforeAll(function(callback) {
        org.ekstep.contentrenderer.loadPlugins([{"id":"org.sunbird.player.userswitcher","ver":1,"type":"plugin"}], [], function() {
   			console.log("Sunbird user switch plugin is loaded");
			userSwitcherInstance = org.ekstep.pluginframework.pluginManager.pluginObjs['org.sunbird.player.userswitcher'];
			manifest = org.ekstep.pluginframework.pluginManager.pluginManifests['org.sunbird.player.userswitcher'];
            callback();
		});
    });
    describe("When plugin is initialized", function() {
    	it("It should initialized userSwitcher plugin", function() {
            spyOn(userSwitcherInstance, 'initialize').and.callThrough();
            userSwitcherInstance.initialize(manifest);
            console.log("manifest", manifest);
            console.log("userSwitcherInstance", userSwitcherInstance);
            expect(userSwitcherInstance.initialize).toHaveBeenCalled();
            expect(userSwitcherInstance._templatePath).not.toBeUndefined();
            expect(userSwitcherInstance.controllerPath).not.toBeUndefined();
        });
    });
});