import { DiscussionService } from './services/discussion/discussion.service';
import { SuiModalModule } from 'ng2-semantic-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussionRoutingModule } from './discussion-routing.module';
import { ForumComponent } from './components/forum/forum.component';
import { DiscussionUiModule, DiscussionEventsService } from '@project-sunbird/discussions-ui-v8';
import { DiscussionTelemetryService } from '../shared/services/discussion-telemetry/discussion-telemetry.service';

import * as _ from 'lodash-es';


@NgModule({
  imports: [
    CommonModule,
    SuiModalModule,
    DiscussionUiModule
  ],
  exports: [ DiscussionUiModule ],
  declarations: [ ForumComponent ],
  providers: [ DiscussionService ]
})
export class DiscussionModule {
  constructor(private discussionEvents: DiscussionEventsService, private discussionTelemetryService: DiscussionTelemetryService) {
    this.discussionEvents.telemetryEvent.subscribe(event => {
      this.discussionTelemetryService.logTelemetryEvent(event);
    });
  }
}
