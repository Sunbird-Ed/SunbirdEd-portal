import { PluginData, PluginPlacement } from './models';
export interface IPluginData {
    type: IPluginClass;
    config: IPluginClass['_pluginConfig'];
    instance: new () => IPluginClass;
}
export interface IPluginClass {
    new (): any;
    _pluginConfig?: IPluginConfig;
}
export interface IPluginConfig {
    name: string;
    description: string;
    placements: Array<PluginPlacement>;
}
export declare class PluginService {
    plugins: Array<IPluginData>;
    change: any;
    private config;
    constructor();
    loadPlugins(config: any): void;
    loadPlugin(plugin: IPluginClass): void;
    removePlugin(name: string): void;
    getPluginData(name: string): Array<PluginData>;
}
