import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MergeAccountRoutingModule} from './merge-account-routing.module';
import {UserDetailsComponent} from './components/user-details/user-details.component';
import {SharedModule} from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui';
import {ReactiveFormsModule} from '@angular/forms';
import { MergeAccountStatusComponent } from './components/merge-account-status/merge-account-status.component';


@NgModule({
  declarations: [UserDetailsComponent, MergeAccountStatusComponent],
  imports: [
    CommonModule,
    SharedModule,
    SuiModule,
    MergeAccountRoutingModule,
    ReactiveFormsModule
  ]
})
export class MergeAccountModule {
}
