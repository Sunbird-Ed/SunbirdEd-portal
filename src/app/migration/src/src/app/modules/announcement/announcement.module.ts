import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService, PaginationService, ToasterService, RouterNavigationService} from '@sunbird/shared';
import { AnnouncementService} from '@sunbird/core';
import { OutboxComponent, DeleteComponent, DetailsComponent} from './components/index';
import { GeoExplorerComponent } from './components/geo-explorer/geo-explorer.component';
import { GeoExplorerService } from './services';
import { DetailsPopupComponent } from './components/details-popup/details-popup.component';

@NgModule({
  imports: [
    CommonModule,
    AnnouncementRoutingModule,
    SharedModule, FormsModule,
    SuiModule
  ],
  declarations: [OutboxComponent, DeleteComponent, DetailsComponent, GeoExplorerComponent, DetailsPopupComponent],
  providers: [AnnouncementService, ResourceService, PaginationService, ToasterService, GeoExplorerService, RouterNavigationService]
})
export class AnnouncementModule { }
