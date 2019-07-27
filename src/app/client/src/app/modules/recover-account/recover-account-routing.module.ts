import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdentifyAccountComponent, SelectContactTypeComponent, VerifyContactTypeComponent, ResetPasswordComponent } from './components';

const routes: Routes = [
  {
    path: 'identify/account', component: IdentifyAccountComponent, data: { telemetry: { }}
  }, {
    path: 'select/contact/type', component: SelectContactTypeComponent, data: { telemetry: { }}
  }, {
    path: 'verify/contact/type', component: VerifyContactTypeComponent, data: { telemetry: { }}
  }, {
    path: 'reset/password', component: ResetPasswordComponent, data: { telemetry: { }}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecoverAccountRoutingModule { }
