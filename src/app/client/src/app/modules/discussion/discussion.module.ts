import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussionRoutingModule } from './discussion-routing.module';
import { DiscussionsComponent } from './components/discussions/discussions.component';

@NgModule({
  imports: [
    CommonModule,
    DiscussionRoutingModule
  ],
  declarations: [DiscussionsComponent],
  exports: [DiscussionsComponent]
})
export class DiscussionModule { }
