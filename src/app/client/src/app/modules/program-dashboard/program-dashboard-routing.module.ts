import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatasetsComponent } from './components/datasets/datasets.component';
// import { programManagerGuard  } from './guard';
import { AuthGuard } from '../core/guard/auth-gard.service';
const telemetryEnv = 'program-dashboard';

const routes: Routes = [
  {
    path: '',
    component: DatasetsComponent,
    canActivate: [AuthGuard],
    data: {
      roles: 'programManagerRole',
      telemetry: {
        env: telemetryEnv, pageid: 'program-datasets', type: 'view'
      }
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class programDashboardRoutingModule { }
