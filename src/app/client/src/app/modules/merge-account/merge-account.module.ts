import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MergeAccountRoutingModule} from './merge-account-routing.module';
import {SharedModule} from '@sunbird/shared';
import {MergeAccountStatusComponent} from './components/merge-account-status/merge-account-status.component';


@NgModule({
  declarations: [MergeAccountStatusComponent],
  imports: [
    CommonModule,
    SharedModule,
    MergeAccountRoutingModule
  ]
})
export class MergeAccountModule {
}
