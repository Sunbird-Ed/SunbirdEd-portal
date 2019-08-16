import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent, OtpComponent } from './components';
const telemetryEnv = 'signup';
import { UUID } from 'angular2-uuid';
const uuid = UUID.UUID();

const routes: Routes = [
  {
    path: '', component: SignupComponent,
    data: {
      hideHeaderNFooter : true,
      telemetry: {
        env: telemetryEnv, pageid: 'signup', uri: '/signup',
        type: 'view', mode: 'self', uuid: uuid
      }
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignupRoutingModule { }
