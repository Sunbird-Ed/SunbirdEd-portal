import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MergeAccountRoutingModule} from './merge-account-routing.module';
import {SharedModule} from '@sunbird/shared';
import {
  SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule, SuiCheckboxModule
} from 'ng2-semantic-ui';
import {MergeAccountStatusComponent} from './components/merge-account-status/merge-account-status.component';
import { MergeLoginComponent } from './components/merge-login/merge-login.component';


@NgModule({
  declarations: [MergeAccountStatusComponent, MergeLoginComponent],
  imports: [
    CommonModule,
    SharedModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule, SuiCheckboxModule,
    MergeAccountRoutingModule
  ]
})
export class MergeAccountModule {
}
