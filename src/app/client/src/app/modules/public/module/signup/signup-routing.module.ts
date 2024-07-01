import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './components';
const telemetryEnv = 'signup';
import { v4 as UUID } from 'uuid';
const uuid = UUID();

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
