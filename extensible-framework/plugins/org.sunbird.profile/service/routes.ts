import framework from '../../../src/framework/frameworkAPI';
import { PluginRoutes } from './profileRouter';

const routerRegistry = framework.getService('RouterRegistry');

routerRegistry.register({
	pluginId: "org.sunbird.profile",
	routes: [{
		method: 'ALL',
		URL: '/learner/*',
		handler: PluginRoutes.proxyToLearnerService(),
		dependentHandlers: [PluginRoutes.verifyTokenMiddleware]
	}]
});

