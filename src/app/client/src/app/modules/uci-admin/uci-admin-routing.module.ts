import { UciComponent } from './components/uci/uci.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guard';

const routes: Routes = [
  { 
    path: '', 
    component: UciComponent, 
    canActivate: [AuthGuard], 
    data: {
      roles: 'uciAdmin',
      telemetry: {
        env: 'uci-admin', pageid: 'uci-admin-page', type: 'view'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UciAdminRoutingModule { }
