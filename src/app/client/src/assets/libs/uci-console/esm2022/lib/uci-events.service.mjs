import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
/* tslint:disable */
import * as _ from 'lodash';
import * as i0 from "@angular/core";
/* tslint:enable */
export class UciEventsService {
    constructor() {
        this.telemetryEvent = new Subject();
        this.actionEvent = new EventEmitter();
    }
    emitTelemetry(event) {
        // console.log('Lib Event', event);
        if (!_.isEmpty(event)) {
            this.telemetryEvent.next(event);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: UciEventsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: UciEventsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: UciEventsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWNpLWV2ZW50cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvdWNpLWNvbnNvbGUvc3JjL2xpYi91Y2ktZXZlbnRzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixvQkFBb0I7QUFDcEIsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUE7O0FBQzNCLG1CQUFtQjtBQUluQixNQUFNLE9BQU8sZ0JBQWdCO0lBSzNCO1FBSE8sbUJBQWMsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBQ3BDLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztJQUU3QixDQUFDO0lBRWpCLGFBQWEsQ0FBQyxLQUFLO1FBQ2pCLG1DQUFtQztRQUNuQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNyQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNqQztJQUNILENBQUM7K0dBWlUsZ0JBQWdCO21IQUFoQixnQkFBZ0IsY0FGZixNQUFNOzs0RkFFUCxnQkFBZ0I7a0JBSDVCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG4vKiB0c2xpbnQ6ZGlzYWJsZSAqL1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnXG4vKiB0c2xpbnQ6ZW5hYmxlICovXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBVY2lFdmVudHNTZXJ2aWNlIHtcblxuICBwdWJsaWMgdGVsZW1ldHJ5RXZlbnQgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gIHB1YmxpYyBhY3Rpb25FdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgZW1pdFRlbGVtZXRyeShldmVudCkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdMaWIgRXZlbnQnLCBldmVudCk7XG4gICAgaWYgKCFfLmlzRW1wdHkoZXZlbnQpKSB7XG4gICAgICB0aGlzLnRlbGVtZXRyeUV2ZW50Lm5leHQoZXZlbnQpO1xuICAgIH1cbiAgfVxufVxuIl19