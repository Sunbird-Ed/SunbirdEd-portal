import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdentifyAccountComponent, SelectAccountIdentifierComponent, VerifyAccountIdentifierComponent,
  ResetPasswordComponent, RecoverAccountComponent } from './components';
const telemetryEnv = 'AccountRecovery';

const routes: Routes = [
  {
    path: '', component: RecoverAccountComponent,
    children: [{
      path: 'identify/account', component: IdentifyAccountComponent, data: {
        telemetry: { env: telemetryEnv, pageid: 'IdentifyAccount', type: 'view', subtype: 'paginate' },
      }
    }, {
      path: 'select/account/identifier', component: SelectAccountIdentifierComponent, data: {
        telemetry: { env: telemetryEnv, pageid: 'SelectIdentifier', type: 'view', subtype: 'paginate' },
      }
    }, {
      path: 'verify/account/identifier', component: VerifyAccountIdentifierComponent, data: {
        telemetry: { env: telemetryEnv, pageid: 'VerifyIdentifier', type: 'view', subtype: 'paginate' },
      }
    }
    // , {
    //   path: 'reset/password', component: ResetPasswordComponent, data: {
    //     telemetry: { env: telemetryEnv, pageid: 'ResetPassword', type: 'view', subtype: 'paginate' },
    //   }
    // }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecoverAccountRoutingModule { }
