import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussionRoutingModule } from './discussion-routing.module';
import { ForumComponent } from './components/forum/forum.component';

@NgModule({
  imports: [
    CommonModule,
    DiscussionRoutingModule
  ],
  declarations: [ForumComponent]
})
export class DiscussionModule { }
