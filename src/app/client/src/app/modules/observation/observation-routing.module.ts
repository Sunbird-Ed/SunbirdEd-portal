import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ObservationDetailsComponent, ObservationListingComponent } from './components';
const telemetryEnv = 'observation';

const routes: Routes = [
    {
        path: '',
        component: ObservationListingComponent,
        data: {
            telemetry: { env: telemetryEnv, pageid: 'observation-list', type: 'view' },
        }
    },
    {
        path: 'details',
        component: ObservationDetailsComponent,
        data: {
            telemetry: { env: telemetryEnv, pageid: 'observation-details', type: 'view' },
            menuBar: {
                visible: false
            }
        }
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ObservationRoutingModule { }

