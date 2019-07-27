import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecoverAccountRoutingModule } from './recover-account-routing.module';
import { IdentifyAccountComponent, SelectAccountIdentifierComponent, VerifyAccountIdentifierComponent,
  ResetPasswordComponent } from './components';
  import { SharedModule } from '@sunbird/shared';

@NgModule({
  declarations: [IdentifyAccountComponent, ResetPasswordComponent, SelectAccountIdentifierComponent, VerifyAccountIdentifierComponent],
  imports: [
    CommonModule,
    RecoverAccountRoutingModule,
    SharedModule
  ]
})
export class RecoverAccountModule { }
