import { PluginService } from './plugin-service';
export declare class BootstrapFramework {
    private config;
    private pluginService;
    constructor(pluginService: PluginService);
    initialize(config: any): void;
}
