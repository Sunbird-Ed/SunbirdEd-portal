import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdentifyAccountComponent, SelectAccountIdentifierComponent, VerifyAccountIdentifierComponent,
  ResetPasswordComponent, RecoverAccountComponent } from './components';

const routes: Routes = [
  {
    path: '', component: RecoverAccountComponent,
    children: [{
      path: 'identify/account', component: IdentifyAccountComponent, data: { telemetry: { }}
    }, {
      path: 'select/account/identifier', component: SelectAccountIdentifierComponent, data: { telemetry: { }}
    }, {
      path: 'verify/account/identifier', component: VerifyAccountIdentifierComponent, data: { telemetry: { }}
    }, {
      path: 'reset/password', component: ResetPasswordComponent, data: { telemetry: { }}
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecoverAccountRoutingModule { }
