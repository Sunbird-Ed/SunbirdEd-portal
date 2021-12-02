import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolutionListingComponent } from './components';
import { ReportViewComponent } from './components/report-view/report-view.component';
const telemetryEnv = 'solution';


const routes: Routes = [
    {
        path: 'solution-listing',
        component: SolutionListingComponent,
        data: {
            telemetry: { env: telemetryEnv, pageid: 'solution-listing', type: 'view' },
            menuBar: {
                visible: false
              }
        }
    },
    {
        path: 'report-view',
        component: ReportViewComponent,
        data: {
            telemetry: { env: telemetryEnv, pageid: 'report-view', type: 'view' },
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
export class ReportRoutingModule { }
