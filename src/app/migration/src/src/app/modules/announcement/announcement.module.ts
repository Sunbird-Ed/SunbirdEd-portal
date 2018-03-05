import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService, PaginationService, ToasterService} from '@sunbird/shared';

import { AnnouncementService} from '@sunbird/core';
import { OutboxComponent, DeleteComponent} from './components/index';
import { InboxComponent } from './components/inbox/inbox.component';

@NgModule({
  imports: [
    CommonModule,
    AnnouncementRoutingModule,
     SharedModule,
    SuiModule
  ],
  declarations: [OutboxComponent, DeleteComponent, InboxComponent],
  providers: [AnnouncementService, ResourceService, PaginationService, ToasterService]
})
export class AnnouncementModule { }
