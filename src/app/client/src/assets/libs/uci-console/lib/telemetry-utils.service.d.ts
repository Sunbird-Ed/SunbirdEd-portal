import { UciEventsService } from './uci-events.service';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
export declare class TelemetryUtilsService {
    private discussionEvents;
    private router;
    _context: any[];
    currentObj: {};
    constructor(discussionEvents: UciEventsService, router: Router);
    setContext(context: any): void;
    uppendContext(data: any): void;
    deleteContext(prevTopic: any): void;
    getContext(): any[];
    logImpression(pageId: any): void;
    logInteract(event: any, pageId: any): void;
    getRollUp(): {};
    static ɵfac: i0.ɵɵFactoryDeclaration<TelemetryUtilsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TelemetryUtilsService>;
}
//# sourceMappingURL=telemetry-utils.service.d.ts.map