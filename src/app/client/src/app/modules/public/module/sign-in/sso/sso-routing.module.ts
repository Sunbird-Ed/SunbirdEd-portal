import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthFailedComponent, SelectOrgComponent, UpdateContactComponent} from './components';
import { v4 as UUID } from 'uuid';
const uuid = UUID();
const telemetryEnv = 'sso-sign-in';
const routes: Routes = [
  {
    path: 'select-org', component: SelectOrgComponent,
    data: {
      hideHeaderNFooter : true,
      telemetry: {
        env: telemetryEnv, pageid: 'select-org', uri: '/select-org', type: 'view', mode: 'self', uuid: uuid
      }
    }
  },
  {
    path: 'update/contact', component: UpdateContactComponent,
    data: {
      hideHeaderNFooter : true,
      telemetry: {
        env: telemetryEnv, pageid: 'update-contact', uri: '/update-contact', type: 'view', mode: 'self', uuid: uuid
      }
    }
  },
  {
    path: 'auth', component: AuthFailedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SsoRoutingModule { }
