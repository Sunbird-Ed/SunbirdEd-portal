import { DiscussionService } from './services/discussion/discussion.service';
import { SuiModalModule } from 'ng2-semantic-ui-v9';
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
  imports: [CommonModule, SuiModalModule, DiscussionUiModule],
  exports: [DiscussionUiModule, AccessDiscussionComponent],
  declarations: [ForumComponent, AccessDiscussionComponent],
  providers: [DiscussionService],
})
export class DiscussionModule {
  constructor(
    private discussionEvents: DiscussionEventsService,
    private discussionTelemetryService: DiscussionTelemetryService,
    private navigationHelperService: NavigationHelperService,
    private router: Router
  ) {
    this.discussionEvents.telemetryEvent.subscribe((event) => {
      this.discussionTelemetryService.logTelemetryEvent(event);
    });

    // Remove DF routes from history
    if(this.router.events) {
      this.router.events.subscribe((e) => {
        if (e instanceof NavigationEnd) {
          // waiting for the DF routes to be added in the history by navigationService.
          // Do not remove the setTimeout(), because after the routerEvent subscribe in navigationService,
          // popHistory() should be called.
          if(e.url && e.url.includes('discussion-forum')){
            setTimeout(() => {
              this.navigationHelperService.popHistory();
            }, 200);
          }
        }
      });
    }
  }
}
