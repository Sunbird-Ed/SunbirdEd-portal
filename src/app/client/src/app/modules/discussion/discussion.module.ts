import { SuiModalModule } from 'ng2-semantic-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussionRoutingModule } from './discussion-routing.module';
import { ForumComponent } from './components/forum/forum.component';

@NgModule({
  imports: [
    CommonModule,
    DiscussionRoutingModule,
    SuiModalModule
  ],
  declarations: [ForumComponent]
})
export class DiscussionModule { }
