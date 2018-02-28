import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';

import { AnnouncementService, PaginationService, ResourceService} from '@sunbird/core';
import { OutboxComponent, DeleteComponent} from './components/index';

@NgModule({
  imports: [
    CommonModule,
    AnnouncementRoutingModule,
     SharedModule,
    SuiModule
  ],
  declarations: [OutboxComponent, DeleteComponent],
  providers: [AnnouncementService, PaginationService, ResourceService]
})
export class AnnouncementModule { }
