import {Registry, PluginStatusEnum } from './interfaces/RegistryInterface';
import * as _ from 'lodash';
import {ManifestInterface} from './interfaces/ManifestInterface';

class PluginRegistry {
	private static instance: PluginRegistry;
	private registeredPlugins: Registry[] = []

	constructor() {

	}

	static getInstance() {
        if (!PluginRegistry.instance) {
            PluginRegistry.instance = new PluginRegistry();
        }
        return PluginRegistry.instance;
    }

	public register(manifest: ManifestInterface) {
		manifest = this.registryBuilder(manifest);
		let pluginFound = _.find(this.registeredPlugins, function(plugin) {
			return plugin.id === manifest.id;
		})
		if (pluginFound) {
			throw new Error(`Plugin ${manifest.id} is already registered!`);
		} else {
			this.registeredPlugins.push(manifest)			
		}		
	}

	public isRegistered(pluginId: string): boolean {
		let pluginFound = _.find(this.registeredPlugins, function(plugin) {
			return plugin.id === pluginId;
		})
		if (pluginFound) return true;
		return false;
	}


	public getStatus(pluginId: string): string {
		let plugin = _.find(this.registeredPlugins, function(plugin) {
			return plugin.id === pluginId;
		})
		if (plugin) return PluginStatusEnum[plugin.status]
		return PluginStatusEnum[0] //unknown status
	}

	public unregister(registry: Registry): boolean {
		return true
	}

	public updateStatus(pluginId: string, status: PluginStatusEnum): boolean {
		let plugin = _.find(this.registeredPlugins, function(plugin) {
			return plugin.id === pluginId;
		})

		if (plugin) { 
			plugin.status = status
			return true
		}

		return false
	}

	public registryBuilder(data: ManifestInterface): Registry {
		return {
			name: data.name,
			type: data.type,
			id: data.id,
			version: data.version,
			repo: data.version,
			status: PluginStatusEnum.unknown
		}
	}


}

export const pluginRegistry = PluginRegistry.getInstance()
	