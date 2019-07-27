import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecoverAccountRoutingModule } from './recover-account-routing.module';
import { IdentifyAccountComponent, SelectContactTypeComponent, VerifyContactTypeComponent, ResetPasswordComponent } from './components';

@NgModule({
  declarations: [IdentifyAccountComponent, SelectContactTypeComponent, VerifyContactTypeComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    RecoverAccountRoutingModule
  ]
})
export class RecoverAccountModule { }
