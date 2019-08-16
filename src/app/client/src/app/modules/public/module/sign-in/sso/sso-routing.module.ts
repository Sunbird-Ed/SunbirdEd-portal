import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectOrgComponent, UpdateContactComponent } from './components';
import { UUID } from 'angular2-uuid';
const uuid = UUID.UUID();
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SsoRoutingModule { }
