import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LibraryComponent, TelemetryComponent } from './components';

const routes: Routes = [
    {
        path: 'mydownloads', component: LibraryComponent, data: {
            telemetry: {
                env: 'library', pageid: 'library', type: 'view'
            },
            softConstraints: { badgeAssertions: 98, board: 99, channel: 100 }
        }
    }, {
        path: 'telemetry', component: TelemetryComponent, data: {
            telemetry: {
                env: 'telemetry', pageid: 'telemetry', type: 'view'
            }
        }
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OfflineRoutingModule { }
