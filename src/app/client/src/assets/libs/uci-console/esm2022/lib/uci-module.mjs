import { TelemetryUtilsService } from './telemetry-utils.service';
import { LibEntryComponent } from './components/lib-entry/lib-entry.component';
import { ComponentsModule } from './components/components.module';
import { UciRoutingModule } from './uci-routing/uci-routing.module';
import { NgModule } from '@angular/core';
import { UciEventsService } from './uci-events.service';
import * as i0 from "@angular/core";
export function provideCsModule() {
    return window['CsModule'];
}
export class UciModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: UciModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: UciModule, declarations: [LibEntryComponent], imports: [ComponentsModule,
            UciRoutingModule], exports: [LibEntryComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: UciModule, providers: [UciEventsService, TelemetryUtilsService, { provide: 'CsModule', useFactory: provideCsModule }], imports: [ComponentsModule,
            UciRoutingModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: UciModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        LibEntryComponent
                    ],
                    imports: [
                        ComponentsModule,
                        UciRoutingModule
                    ],
                    exports: [
                        LibEntryComponent
                    ],
                    providers: [UciEventsService, TelemetryUtilsService, { provide: 'CsModule', useFactory: provideCsModule }]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWNpLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3VjaS1jb25zb2xlL3NyYy9saWIvdWNpLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw0Q0FBNEMsQ0FBQztBQUM3RSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNoRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUVsRSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDOztBQUV0RCxNQUFNLFVBQVUsZUFBZTtJQUMzQixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBZUQsTUFBTSxPQUFPLFNBQVM7K0dBQVQsU0FBUztnSEFBVCxTQUFTLGlCQVhkLGlCQUFpQixhQUdqQixnQkFBZ0I7WUFDaEIsZ0JBQWdCLGFBR2hCLGlCQUFpQjtnSEFJWixTQUFTLGFBRlAsQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBQyxDQUFDLFlBTnBHLGdCQUFnQjtZQUNoQixnQkFBZ0I7OzRGQU9YLFNBQVM7a0JBYnJCLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFO3dCQUNWLGlCQUFpQjtxQkFDcEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLGdCQUFnQjt3QkFDaEIsZ0JBQWdCO3FCQUNuQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsaUJBQWlCO3FCQUNwQjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBQyxDQUFDO2lCQUMzRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VGVsZW1ldHJ5VXRpbHNTZXJ2aWNlfSBmcm9tICcuL3RlbGVtZXRyeS11dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7TGliRW50cnlDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9saWItZW50cnkvbGliLWVudHJ5LmNvbXBvbmVudCc7XG5pbXBvcnQge0NvbXBvbmVudHNNb2R1bGV9IGZyb20gJy4vY29tcG9uZW50cy9jb21wb25lbnRzLm1vZHVsZSc7XG5pbXBvcnQge1VjaVJvdXRpbmdNb2R1bGV9IGZyb20gJy4vdWNpLXJvdXRpbmcvdWNpLXJvdXRpbmcubW9kdWxlJztcblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7VWNpRXZlbnRzU2VydmljZX0gZnJvbSAnLi91Y2ktZXZlbnRzLnNlcnZpY2UnO1xuXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZUNzTW9kdWxlKCkge1xuICAgIHJldHVybiB3aW5kb3dbJ0NzTW9kdWxlJ107XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIExpYkVudHJ5Q29tcG9uZW50XG4gICAgXSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbXBvbmVudHNNb2R1bGUsXG4gICAgICAgIFVjaVJvdXRpbmdNb2R1bGVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgTGliRW50cnlDb21wb25lbnRcbiAgICBdLFxuICAgIHByb3ZpZGVyczogW1VjaUV2ZW50c1NlcnZpY2UsIFRlbGVtZXRyeVV0aWxzU2VydmljZSwge3Byb3ZpZGU6ICdDc01vZHVsZScsIHVzZUZhY3Rvcnk6IHByb3ZpZGVDc01vZHVsZX1dXG59KVxuZXhwb3J0IGNsYXNzIFVjaU1vZHVsZSB7XG59XG4iXX0=