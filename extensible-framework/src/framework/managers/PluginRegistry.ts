import {Registry, PluginStatusEnum } from './RegistryInterface';
import * as _ from 'lodash';
import {ManifestInterface} from '../interfaces/ManifestInterface';
import {ElasticsearchStore} from '../database/elasticsearch/ElasticsearchStore'

class PluginRegistry {
	private static instance: PluginRegistry;
	private registeredPlugins: Registry[] = []
	private ES_REGISTRY_INDEX: string = "core.extensible.framework";
	private ESSessionInstance: any;
	private ES_REGISTRY_TYPE: string = "plugin-registry";

	constructor() {
		this.ESSessionInstance = ElasticsearchStore.getConnection(this.ES_REGISTRY_INDEX)
	}

	static getInstance() {
        if (!PluginRegistry.instance) {
            PluginRegistry.instance = new PluginRegistry();
        }
        return PluginRegistry.instance;
    }

	public register(manifest: ManifestInterface) {
		const registryObject: Registry = this.registryBuilder(manifest);
		this.getRegisteredPlugin(registryObject.id, (err, res) => {
			if (res) console.log(`Plugin: ${registryObject.id} is already registered!`);
			if (err) {
				this.persistRegistry(registryObject, (err, res) => {
					if (err) console.log(`${registryObject.id}: plugin unable to register!`);
					if (res) console.log(`plugin is registered: ${registryObject.id}`)
				})
			}
		})
	}

	private persistRegistry(registryObject: Registry, callback = (...args:any[]) => {}) {
		this.ESSessionInstance.insertOne({
			type: this.ES_REGISTRY_TYPE,
			body: registryObject,
			id: registryObject.id
		}, callback)
	}

	public getRegisteredPlugin(pluginId: string, callback = (...args:any[]) => {}): void {
		this.ESSessionInstance.find({ 
			DSL: this.ESSessionInstance
			.utils()
			.getBodybuilder()
			.query('match', '_id', pluginId)
			.build()
		}, (err, res) => {
			if (res) callback(undefined, _.get(res, "hits.hits[0]._source"))
			if (err) callback(new Error(`Plugin: ${pluginId} is not registered!`))
		});
	}

	public getStatus(pluginId: string): string {
		// let plugin = _.find(this.registeredPlugins, function(plugin) {
		// 	return plugin.id === pluginId;
		// })
		// if (plugin) return PluginStatusEnum[plugin.status]
		// return PluginStatusEnum[0] //unknown status
	}

	public unregister(registry: Registry): boolean {
		return true
	}

	public updateStatus(pluginId: string, status: PluginStatusEnum) {
		this.ESSessionInstance.updateOne({type: this.ES_REGISTRY_TYPE, id: pluginId, body: { status }});
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
	