import { ViewContainerRef, ComponentFactoryResolver, OnDestroy, OnChanges, EventEmitter, OnInit } from '@angular/core';
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
    constructor(viewContainerRef: any, componentResolver: any, pluginService: any);
    ngOnInit(): void;
    initialize(): any;
    instantiatePluginComponent(pluginData: any): any;
    ngOnChanges(): void;
    ngOnDestroy(): void;
}
