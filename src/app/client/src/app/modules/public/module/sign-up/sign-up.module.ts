import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent, OtpComponent } from './components';
import { SignUpRoutingModule } from './sign-up-routing.module';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { SignUpService } from './services';

@NgModule({
  imports: [
    CommonModule,
    SignUpRoutingModule,
    SuiModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule
  ],
  declarations: [SignUpComponent, OtpComponent],
  providers: [SignUpService]
})
export class SignUpModule { }
