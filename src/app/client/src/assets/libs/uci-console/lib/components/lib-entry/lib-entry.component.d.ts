import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UciEventsService } from '../../uci-events.service';
import { ConfigService } from '../../services/config.service';
import { UciService } from '../../services/uci.service';
import { TelemetryUtilsService } from '../../telemetry-utils.service';
import { GlobalService } from '../../services/global.service';
import * as i0 from "@angular/core";
export declare class LibEntryComponent implements OnInit {
    activatedRoute: ActivatedRoute;
    private uciService;
    private configService;
    private location;
    private uciEventsService;
    private telemetryUtils;
    private globalService;
    private router;
    user: any;
    baseUrl: any;
    constructor(activatedRoute: ActivatedRoute, uciService: UciService, configService: ConfigService, location: Location, uciEventsService: UciEventsService, telemetryUtils: TelemetryUtilsService, globalService: GlobalService, router: Router);
    ngOnInit(): void;
    goBack(): void;
    close(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LibEntryComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LibEntryComponent, "lib-lib-entry", never, { "user": { "alias": "user"; "required": false; }; "baseUrl": { "alias": "baseUrl"; "required": false; }; }, {}, never, never, false, never>;
}
//# sourceMappingURL=lib-entry.component.d.ts.map