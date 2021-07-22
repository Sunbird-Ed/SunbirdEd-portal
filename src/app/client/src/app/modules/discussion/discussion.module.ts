import { DiscussionService } from './services/discussion/discussion.service';
import { SuiModalModule } from 'ng2-semantic-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussionRoutingModule } from './discussion-routing.module';
import { ForumComponent } from './components/forum/forum.component';
import { DiscussionUiModule, DiscussionEventsService } from '@project-sunbird/discussions-ui-v8';
import { DiscussionTelemetryService } from '../shared/services/discussion-telemetry/discussion-telemetry.service';
import * as _ from 'lodash-es';
import { NavigationHelperService } from '@sunbird/shared';
import { AccessDiscussionComponent } from './components/access-discussion/access-discussion.component';
import { NavigationEnd, Router } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SuiModalModule,
    DiscussionUiModule
  ],
  exports: [ DiscussionUiModule , AccessDiscussionComponent],
  declarations: [ ForumComponent, AccessDiscussionComponent ],
  providers: [ DiscussionService ]
})
export class DiscussionModule {
  constructor(
    private discussionEvents: DiscussionEventsService,
    private discussionTelemetryService: DiscussionTelemetryService,
    private navigationHelperService: NavigationHelperService,
    private router: Router) {
    this.discussionEvents.telemetryEvent.subscribe(event => {
      this.discussionTelemetryService.logTelemetryEvent(event);
    });

    // Remove DFroutes from history
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
          setTimeout(() => {
            this.navigationHelperService.popHistory()
          }, 200)
      }
    })
  }

}
