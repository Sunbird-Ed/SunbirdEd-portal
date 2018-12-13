import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './components';
import { SignUpRoutingModule } from './sign-up-routing.module';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SignUpRoutingModule,
    SuiModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [SignUpComponent]
})
export class SignUpModule { }
