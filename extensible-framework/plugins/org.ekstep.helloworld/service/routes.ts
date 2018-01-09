import {routerRegistry} from '../../../src/framework/RouterRegistry'
import {expressApp} from '../../../src/MiddlewareApp';

routerRegistry.registerRoute({ 
	pluginId: "org.ekstep.helloworld",
	routes: [{
		method: 'GET',
		URL: '/get',
		handler: function(req, res, next) {
			res.send('invoked helloworld plugin /get route')
		}				
	}]
});

expressApp.listen('9000');
