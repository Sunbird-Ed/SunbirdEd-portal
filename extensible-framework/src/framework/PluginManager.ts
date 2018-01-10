import * as fs from 'fs'
import * as path from 'path'
import * as _ from 'lodash'
import { pluginRegistry } from './PluginRegistry'
import {Registry, PluginStatusEnum } from './interfaces/RegistryInterface'
import {cassandraStoreValidator} from './services/cassandra/CassandraStoreValidator'
import * as nodeEval from 'node-eval'
import Global from '../../global-config'
import * as ts from 'typescript'
import * as FolderStructureDefinition from './FolderStructureDefinition.json'

interface PluginInfo {
	id: string; 
	ver: string; 
	scope: string;
}

export class PluginManager {
	private static instance: PluginManager;
	//TODO: get the plugin repo from config
	private pluginRepoPath: string = Global.rootPath + '/plugins'
	// member to store plugin instances
	private _pluginInstances: object[] = [];
	private CassandraSchemaPath: string;

	constructor() {
		this.CassandraSchemaPath = FolderStructureDefinition.SERVICE.CASSANDRA_SCHEMA_PATH;
	}

	//singleton 
	static getInstance() {
        if (!PluginManager.instance) {
            PluginManager.instance = new PluginManager();
        }
        return PluginManager.instance;
    }

	//1. discover plugin
	//2. transpile and compile the plugin code
	//3. Resolve dependencies //TODO
	//2. register namespace with registry
	//3. register data models if any 
	//4. set the status of plugin to `installed`
	public installPlugin(plugin: PluginInfo[]): void {		
		//this.discoverPlugin(pluginInfo)
		_.forEach(plugin, (pluginInfo) => {
			const source = fs.readFileSync(path.join(this.pluginRepoPath, pluginInfo.id, FolderStructureDefinition.SERVICE.PLUGIN_PATH), 'utf8')

			// transpile the plugin code to plain Javascript
			let result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, experimentalDecorators: true, emitDecoratorMetadata: true }  });

			//Eval javascript code
			let pluginCode = nodeEval(result.outputText, path.join(this.pluginRepoPath, pluginInfo.id, FolderStructureDefinition.SERVICE.PLUGIN_PATH));

			let plugin = new pluginCode.ExtPlugin();
			this._pluginInstances.push(plugin);

			pluginRegistry.register(plugin._manifest)
			console.log(` plugin is registered? ${pluginRegistry.isRegistered(pluginInfo.id)}`)

			this.registerDatastoreSchema(pluginInfo)

			pluginRegistry.updateStatus(pluginInfo.id, PluginStatusEnum.installed)
			console.log(`plugin status after install: ${pluginRegistry.getStatus(pluginInfo.id)}`)

			if(plugin.onInstall) plugin.onInstall();
		})
	}

	private discoverPlugin(pluginInfo: PluginInfo): any {		
		
		
	}

	//1. register routes with app
	public activatePlugin(plugin: PluginInfo) {
		_.forEach(plugin, (pluginInfo) => {
			let plugin = _.find(this._pluginInstances, (plugin) => {
				return plugin._manifest.id === pluginInfo.id
			})

			this.registerRoutes(pluginInfo);
			if(plugin.onStart) plugin.onStart();
		})
	}

	private registerRoutes(pluginInfo: PluginInfo) {
		const routes = fs.readFileSync(path.join(this.pluginRepoPath, pluginInfo.id, FolderStructureDefinition.SERVICE.ROUTES_SCRIPT_PATH), 'utf8')
		let result = ts.transpileModule(routes, { compilerOptions: { module: ts.ModuleKind.CommonJS, experimentalDecorators: true, emitDecoratorMetadata: true }  });
		let pluginCode = nodeEval(result.outputText, path.join(this.pluginRepoPath, pluginInfo.id, FolderStructureDefinition.SERVICE.ROUTES_SCRIPT_PATH));
	}

	private registerDatastoreSchema(pluginInfo: PluginInfo) {
		try {
			let schemaText = fs.readFileSync(path.join(this.pluginRepoPath, pluginInfo.id, this.CassandraSchemaPath), 'utf8')
			let schema = JSON.parse(schemaText)
			cassandraStoreValidator.registerSchema(pluginInfo.id, schema)
		} catch(e) {
			console.log(new Error('error when reading schema.json'))
		}
	}

	get pluginInstances(): object[] {
		return this._pluginInstances;
	}

}

export const pluginManager = PluginManager.getInstance()