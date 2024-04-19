import { TelemetryUtilsService } from '../../telemetry-utils.service';
import { UciService } from '../../services/uci.service';
import { OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { IdiscussionConfig, IMenuOptions } from '../../models/uci-config.model';
import * as i0 from "@angular/core";
export declare class SidePanelComponent implements OnInit, OnDestroy {
    router: Router;
    uciService: UciService;
    activatedRoute: ActivatedRoute;
    private telemetryUtils;
    private configService;
    paramsSubscription: Subscription;
    userName: string;
    defaultPage: string;
    data: IdiscussionConfig;
    hideSidePanel: boolean;
    menu: Array<IMenuOptions>;
    selectedTab: string;
    showSideMenu: Boolean;
    constructor(router: Router, uciService: UciService, activatedRoute: ActivatedRoute, telemetryUtils: TelemetryUtilsService, configService: ConfigService);
    ngOnInit(): void;
    isActive(selectedItem: any): boolean;
    navigate(pageName: string, event?: any): void;
    ngOnDestroy(): void;
    showMenuButton(): void;
    closeNav(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SidePanelComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SidePanelComponent, "lib-side-panel", never, {}, {}, never, never, false, never>;
}
//# sourceMappingURL=side-panel.component.d.ts.map