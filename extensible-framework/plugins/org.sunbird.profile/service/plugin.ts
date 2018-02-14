import framework from '../../../src/framework/frameworkAPI'

const { Plugin, Inject, DataStore } = framework.getDecorators(['Plugin', 'Inject', 'DataStore']);
const ApiInterceptor = framework.getService('ApiInterceptor');

@Plugin({
	"name": "sunbird profile",
	"id": "org.sunbird.profile",
	"version": "1.0"
})
export class ExtPlugin implements PluginLifeCycleEvents {
	

	onInstall() {}
	onStart() {}
	onStop() {}
	onInit() {}
	onUninstall() {}
	onUpdate() {}
	onDestroy() {}
}