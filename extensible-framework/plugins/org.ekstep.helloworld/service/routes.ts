import {FrameworkAPI} from '../../../src/framework/frameworkAPI'

const { Inject }= FrameworkAPI.getDecorators(['Inject'])

class PluginRoutes {

	@Inject('RouterRegistry')
	private static RouterRegistry: any;

	public static initialize() {
		this.RouterRegistry.registerRoute({ 
			pluginId: "org.ekstep.helloworld",
			routes: [{
				method: 'GET',
				URL: '/get',
				handler: function(req, res, next) {
					res.send('invoked helloworld plugin /get route')
				}				
			}]
		});
	}
}

PluginRoutes.initialize();





