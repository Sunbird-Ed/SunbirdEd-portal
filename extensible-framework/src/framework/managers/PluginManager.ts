import * as fs from 'fs'
import * as path from 'path'
import * as _ from 'lodash'
import * as nodeEval from 'node-eval'
import * as ts from 'typescript'
import * as FolderStructureDefinition from './PluginFolderStructureDefinition.json'
import * as shell from 'shelljs'
import Global from '../../../global-config';
import {RouterRegistry, pluginRegistry} from './index'
import {PluginStatusEnum} from './RegistryInterface'

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
	private _pluginInstances: Array<Object> = [];
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
			const PluginPath = path.join(this.pluginRepoPath, pluginInfo.id)

			this.installNodeModules(path.join(PluginPath, FolderStructureDefinition.SERVICE.PACKAGE_JSON_PATH), pluginInfo.id, (err, res) => {
				if (res) {
					let pluginCode = this.compilePluginCode(PluginPath, pluginInfo.id)
					let plugin = new pluginCode.ExtPlugin();
					this._pluginInstances.push(plugin);
					// register plugin to registry
					pluginRegistry.register(plugin._manifest)
					// register datastore schema
					this.registerDatastoreSchema(pluginInfo)
					// executes route.ts script of plugin
					this.registerRoutes(pluginInfo);

					// update the plugin status to installed
					pluginRegistry.updateStatus(pluginInfo.id, PluginStatusEnum.installed)

					// call plugin lifecycle hook
					if (plugin.onInstall) plugin.onInstall();
				} else {
					throw new Error(`unable to download dependencies for plugin: ${pluginInfo.id}`)
				}
			})
		})
	}

	private discoverPlugin(pluginInfo: PluginInfo): any {


	}

	private compilePluginCode(PluginPath: string, pluginId: string) {
		try {
			const source = fs.readFileSync(path.join(PluginPath, FolderStructureDefinition.SERVICE.PLUGIN_PATH), 'utf8')
			// transpile the plugin code to plain Javascript
			let result = ts.transpileModule(source, {
				compilerOptions: {
					module: ts.ModuleKind.CommonJS,
					experimentalDecorators: true,
					emitDecoratorMetadata: true
				}
			});

			//Eval javascript code
			return nodeEval(result.outputText, path.join(PluginPath, FolderStructureDefinition.SERVICE.PLUGIN_PATH));
		} catch (e) {
			throw `Error while compling plugin code: ${pluginId}: error: ${e}`
		}
	}


	private installNodeModules(rootPath: string, pluginId: string, callback = (...args: any[]) => { }) {
		let packageJsonExist = this.readFileSync(path.join(rootPath, 'package.json'));
		if (packageJsonExist) {
			shell.cd(rootPath);
			console.log(`-------Installing NPM modules for plugin: ${pluginId}------`)
			shell.exec('npm install', (code: number, stdout: string, stderr: string) => {
				console.log('Program output:', stdout);
				console.log('Program stderr:', stderr);
				shell.cd('~')
				if (code !== 0) return callback(new Error(`Error when installing npm modules for plugin: ${pluginId}`))
				callback(undefined, true);
			})
		} else {
			callback(undefined, true)
		}

	}

	private readFileSync(path: string, format?: string): string | null {
		let fileData = null;
		try {
			fileData = fs.readFileSync(path, format)
		} catch (e) { }
		return fileData
	}

	private registerRoutes(pluginInfo: PluginInfo) {
		const routes = this.readFileSync(path.join(this.pluginRepoPath, pluginInfo.id, FolderStructureDefinition.SERVICE.ROUTES_SCRIPT_PATH), 'utf8')
		let result = ts.transpileModule(routes, { compilerOptions: { module: ts.ModuleKind.CommonJS, experimentalDecorators: true, emitDecoratorMetadata: true } });
		let pluginCode = nodeEval(result.outputText, path.join(this.pluginRepoPath, pluginInfo.id, FolderStructureDefinition.SERVICE.ROUTES_SCRIPT_PATH));
	}

	private registerDatastoreSchema(pluginInfo: PluginInfo) {
		try {
			let schemaText = this.readFileSync(path.join(this.pluginRepoPath, pluginInfo.id, this.CassandraSchemaPath), 'utf8')
			if(schemaText) { 
				let schema = JSON.parse(schemaText)
				cassandraStoreValidator.registerSchema(pluginInfo.id, schema)
			}
		} catch (e) {
			console.log(new Error(`error when reading schema.json: ${e}`))
		}
	}

	get pluginInstances(): object[] {
		return this._pluginInstances;
	}

}

export const pluginManager = PluginManager.getInstance()