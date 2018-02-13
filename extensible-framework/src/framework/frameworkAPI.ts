import { PluginLifeCycleEvents }from './interfaces/PluginLifeCycleEventsInterface';
import { envVariables } from './environmentVariables'

type plugin = { _manifest: any }

class FrameworkAPI {
	private static globalObject = global.ext_framework;
	
	
	public static getDecorators(names: Array<string>) {
		const decoratorObject: { [index:string]: any } = {};
		names.forEach((name) => {
			decoratorObject[name] = FrameworkAPI.globalObject.decorator[name];
		})
		return decoratorObject;
	}

	public static getInterface(interfaceName: string): object {
		return FrameworkAPI.globalObject.interface[interfaceName]
	}

	public static getCassandraStoreInstance(instance: plugin): object {
		if (instance && instance._manifest)
		return FrameworkAPI.globalObject.services.CassandraStore.getConnection(instance._manifest.id)
	}

	public static getElasticsearchStoreInstance(instance: plugin): object {
		if (instance && instance._manifest) 
		return FrameworkAPI.globalObject.services.ElasticsearchStore.getConnection(instance._manifest.id)
	}

	public static getService(service: string): (args: Array<any>) => void {
		switch(service) {
			case "RequestAuthenticator":
				return FrameworkAPI.globalObject.services.TokenAuthenticator;
			case "RouterRegistry":
				return FrameworkAPI.globalObject.services.RouterRegistry;
		}
	} 
}

export { PluginLifeCycleEvents, FrameworkAPI, envVariables }