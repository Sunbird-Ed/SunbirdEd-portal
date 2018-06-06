import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussionRoutingModule } from './discussion-routing.module';
import { DiscussionsComponent } from './components/discussions/discussions.component';
import { SharedModule } from '@sunbird/shared';

@NgModule({
  imports: [
    CommonModule,
    DiscussionRoutingModule,
    SharedModule
  ],
  declarations: [DiscussionsComponent],
  exports: [DiscussionsComponent]
})
export class DiscussionModule { }
