export declare class PluginService {
    plugins: any;
    change: any;
    private config;
    constructor();
    loadPlugins(config: any): void;
    loadPlugin(plugin: any): void;
    removePlugin(name: string): void;
    getPluginData(name: string): any;
}
