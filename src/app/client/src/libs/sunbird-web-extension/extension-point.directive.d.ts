import { OnDestroy, OnChanges } from '@angular/core';
import { PluginService } from './plugin-service';
export declare class ExtenstionPointDirective implements OnChanges, OnDestroy {
    name: string;
    override: Boolean;
    viewContainerRef: any;
    componentResolver: any;
    pluginService: PluginService;
    componentRefs: any;
    pluginChangeSubscription: any;
    constructor(viewContainerRef: any, componentResolver: any, pluginService: any);
    initialize(): any;
    instantiatePluginComponent(pluginData: any): any;
    ngOnChanges(): void;
    ngOnDestroy(): void;
}
