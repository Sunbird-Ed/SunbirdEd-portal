import {Registry, PluginStatusEnum } from '../interfaces/RegistryInterface';
import {pluginRegistry} from './pluginRegistry'

export class PluginActivator {
	//Plugin states:
	//1. started: Plugin service is started. 
	//Plugin should be in 'resolved' state before it can be 'started'
	//2. Active: plugin service is active. 
	//PLugin should be in 'started' state
	//3. Stopped: plugin service is stopped. 
	//Plugin should be in 'active'. After plugin is stopped, its status will get back to 'resolved' state

	// In order to achieve this, each plugin service should be running on its own as micro service.
	// With current setup, every registered plugin is sharing the single 'express.js' app instance. 
	// So,stopping single plugin service is impossible

	// use cases:
	// 1. When framework is shutting down, pluginactivator should stop all plugin services
	// 2. When framework is restarted/resumed it should start all plugin servcies
	// 3. it start/stop plugin service at any given point in time. Dynamically initializing the plugin service
	

	public start(pluginRegistry: Registry | Registry[]) {

	}

	public stop() {

	}
}