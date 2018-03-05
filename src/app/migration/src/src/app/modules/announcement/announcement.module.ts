import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService, PaginationService, ToasterService, RouterNavigationService} from '@sunbird/shared';

import { AnnouncementService} from '@sunbird/core';
import { OutboxComponent, DeleteComponent} from './components/index';
import { DetailsComponent } from './components/details/details.component';

@NgModule({
  imports: [
    CommonModule,
    AnnouncementRoutingModule,
     SharedModule,
    SuiModule
  ],
  declarations: [OutboxComponent, DeleteComponent, DetailsComponent],
  providers: [AnnouncementService, ResourceService, PaginationService, ToasterService, RouterNavigationService]
})
export class AnnouncementModule { }
