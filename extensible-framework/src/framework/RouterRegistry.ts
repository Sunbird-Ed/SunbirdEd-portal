import {expressApp} from '../MiddlewareApp';
import * as express from 'express'
import * as _ from 'lodash';

interface HandlerInterface {
  (...args: any[]): void;
}

interface RoutesInterface {
	method: string;
	URL: string;
	handler: HandlerInterface;
	dependentHandlers?: HandlerInterface[];
}

export class RouterRegisty implements RouteProviderInterface {

	private routerMapping: object[] = [];
	private static instance:  RouterRegisty;
	private expressRouter: any;
	private expressApp: any;

	constructor(router: express.Router, expressApp: any) {
		this.expressRouter = router;
		this.expressApp = expressApp;
	}

	public bindToRootRoute(appRoute: any, rootRouteName: string, router: any) {
		appRoute.use('/'+ rootRouteName, router);
	}


	public registerRoute(routeDetails: {pluginId: string, routes: RoutesInterface[]}): undefined  {
		let middlewareRoutes = new this.expressRouter();
		if (!routeDetails.pluginId) return;
		_.forEach(routeDetails.routes, (route) => {
			if (!route.dependentHandlers || _.isEmpty(route.dependentHandlers)) route.dependentHandlers = [];
			switch (route.method) {
				case "GET":
					middlewareRoutes.get(route.URL, route.handler);		
					break;
				case "POST":
					middlewareRoutes.post(route.URL, route.dependentHandlers, route.handler);		
					break;
				case "PUT":
					middlewareRoutes.put(route.URL, route.dependentHandlers, route.handler);		
					break;
				case "DELETE":
					middlewareRoutes.delete(route.URL, route.dependentHandlers, route.handler);		
					break;
			}
		})
		
		// bind to root express app router
		this.bindToRootRoute(this.expressApp, routeDetails.pluginId.toLowerCase().split('.').join('-'), middlewareRoutes)
	}

	//singleton 
	public static getInstance(...args) {
        if (!RouterRegisty.instance) {
            RouterRegisty.instance = new RouterRegisty(...args);
        }
        return RouterRegisty.instance;
    }
}

export const routerRegistry = RouterRegisty.getInstance(express.Router, expressApp); 