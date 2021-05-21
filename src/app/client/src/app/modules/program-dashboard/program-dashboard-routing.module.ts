import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { ProgramDatasetsComponent } from './components/program-datasets/program-datasets.component';
// import { AuthGuard } from '@sunbird/core';
import { programManagerGuard  } from './guard';
const telemetryEnv = 'program-dashboard';

const routes: Routes = [
  {
    path: '',
    component: DatasetsComponent,
    canActivate: [programManagerGuard],
    data: {
      roles: 'programManagerRole',
      telemetry: {
        env: telemetryEnv, pageid: 'program-datasets', type: 'view'
      }
    }
  },
  {
    path: 'datasets',
    component: ProgramDatasetsComponent,
    data: {
      roles: 'programManagerRole',
      telemetry: { env: telemetryEnv, pageid: 'datasets', type: 'view' },
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class programDashboardRoutingModule { }
