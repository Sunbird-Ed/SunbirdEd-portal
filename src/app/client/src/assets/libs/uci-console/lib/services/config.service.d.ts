import { UciService } from './uci.service';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IdiscussionConfig } from '../models/uci-config.model';
import * as i0 from "@angular/core";
export declare class ConfigService implements OnInit {
    activatedRoute: ActivatedRoute;
    private UciService;
    paramsSubscription: Subscription;
    private _config;
    checkContext: boolean;
    queryParams: any;
    getContextData: any;
    hasContextData: any;
    getParams: IdiscussionConfig;
    constructor(activatedRoute: ActivatedRoute, UciService: UciService);
    ngOnInit(): void;
    setConfig(activatedRoute: any): void;
    setConfigFromParams(activatedRoute: any): void;
    getConfig(): IdiscussionConfig;
    getCategories(): any;
    hasContext(): any;
    getContext(): any;
    getRouterSlug(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ConfigService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ConfigService>;
}
//# sourceMappingURL=config.service.d.ts.map