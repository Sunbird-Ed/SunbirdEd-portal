import { FrameworkAPI, envVariables } from '../../../src/framework/frameworkAPI';
import { PluginRoutes } from './profileRouter';

const routerRegistry = FrameworkAPI.getService('RouterRegistry');

routerRegistry.register({
	pluginId: "org.sunbird.profile",
	routes: [{
		method: 'ALL',
		URL: '/learner/*',
		handler: PluginRoutes.proxyToLearnerService(),
		dependentHandlers: [PluginRoutes.verifyTokenMiddleware]
	}]
});

