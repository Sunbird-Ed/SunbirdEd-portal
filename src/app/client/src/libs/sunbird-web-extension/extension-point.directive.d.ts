import { ViewContainerRef, ComponentFactoryResolver, OnDestroy, OnChanges, EventEmitter, OnInit, ComponentRef } from '@angular/core';
import { PluginData } from './models';
import { PluginService } from './plugin-service';
import { Subscription } from 'rxjs';
export declare class ExtensionPointDirective implements OnInit, OnChanges, OnDestroy {
    name: string;
    override: Boolean;
    input: any;
    output: EventEmitter<any>;
    viewContainerRef: ViewContainerRef;
    componentResolver: ComponentFactoryResolver;
    pluginService: PluginService;
    componentRefs: Array<any>;
    pluginChangeSubscription: Subscription;
    constructor(viewContainerRef: ViewContainerRef, componentResolver: ComponentFactoryResolver, pluginService: PluginService);
    ngOnInit(): void;
    initialize(): ComponentRef<any> | Promise<ComponentRef<any>[]>;
    instantiatePluginComponent(pluginData: PluginData): ComponentRef<any>;
    ngOnChanges(): void;
    ngOnDestroy(): void;
}
