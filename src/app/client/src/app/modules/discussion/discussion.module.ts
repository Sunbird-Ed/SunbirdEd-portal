import { DiscussionService } from './services/discussion/discussion.service';
import { SuiModalModule } from '@project-sunbird/ng2-semantic-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumComponent } from './components/forum/forum.component';
import { DiscussionUiModule, DiscussionEventsService } from '@project-sunbird/discussions-ui';
import { DiscussionTelemetryService } from '../shared/services/discussion-telemetry/discussion-telemetry.service';
import { NavigationHelperService, SharedModule } from '@sunbird/shared';
import { AccessDiscussionComponent } from './components/access-discussion/access-discussion.component';
import { NavigationEnd, Router } from '@angular/router';
import { CsModule } from '@project-sunbird/client-services';
import { CsLibInitializerService } from '../../service/CsLibInitializer/cs-lib-initializer.service';

@NgModule({
  imports: [CommonModule, SuiModalModule, DiscussionUiModule, SharedModule.forRoot()],
  exports: [DiscussionUiModule, AccessDiscussionComponent],
  declarations: [ForumComponent, AccessDiscussionComponent],
  providers: [DiscussionService],
})
export class DiscussionModule {
  constructor(
    private discussionEvents: DiscussionEventsService,
    private discussionTelemetryService: DiscussionTelemetryService,
    private navigationHelperService: NavigationHelperService,
    private router: Router,
    private csLibInitializerService: CsLibInitializerService
  ) {
    if (!CsModule.instance.isInitialised) {
      this.csLibInitializerService.initializeCs();
    }

    this.discussionEvents.telemetryEvent.subscribe((event) => {
      this.discussionTelemetryService.logTelemetryEvent(event);
    });

    // Remove DF routes from history
    if (this.router.events) {
      this.router.events.subscribe((e) => {
        if (e instanceof NavigationEnd) {
          // waiting for the DF routes to be added in the history by navigationService.
          // Do not remove the setTimeout(), because after the routerEvent subscribe in navigationService,
          // popHistory() should be called.
          if (e.url && e.url.includes('discussion-forum')) {
            setTimeout(() => {
              this.navigationHelperService.popHistory();
            }, 200);
          }
        }
      });
    }
  }
}
