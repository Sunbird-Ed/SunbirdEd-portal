import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectOrgComponent, UpdatePhoneComponent } from './components';
import { UUID } from 'angular2-uuid';
const uuid = UUID.UUID();
const telemetryEnv = 'sso-sign-in';
const routes: Routes = [
  {
    path: 'select-org', component: SelectOrgComponent,
    data: {
      telemetry: {
        env: telemetryEnv, pageid: 'select-org', uri: '/select-org', type: 'view', mode: 'self', uuid: uuid
      }
    }
  },
  {
    path: 'update-phone', component: UpdatePhoneComponent,
    data: {
      telemetry: {
        env: telemetryEnv, pageid: 'update-phone', uri: '/update-phone', type: 'view', mode: 'self', uuid: uuid
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SsoRoutingModule { }
