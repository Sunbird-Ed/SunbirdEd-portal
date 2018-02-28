import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService, PaginationService} from '@sunbird/shared';

import { AnnouncementService} from '@sunbird/core';
import { OutboxComponent, DeleteComponent} from './components/index';

@NgModule({
  imports: [
    CommonModule,
    AnnouncementRoutingModule,
     SharedModule,
    SuiModule
  ],
  declarations: [OutboxComponent, DeleteComponent],
  providers: [AnnouncementService, ResourceService, PaginationService]
})
export class AnnouncementModule { }
