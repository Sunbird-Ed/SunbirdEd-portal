export declare function PluginConfig(config: any): (type: any) => void;
export declare class PluginPlacement {
    name: any;
    priority: any;
    component: any;
    constructor(options: any);
}
export declare class PluginData {
    plugin: any;
    placement: any;
    constructor(plugin: any, placement: any);
}
