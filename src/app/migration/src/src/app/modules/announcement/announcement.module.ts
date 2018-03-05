import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService, PaginationService, ToasterService} from '@sunbird/shared';
import { AnnouncementService} from '@sunbird/core';
import { OutboxComponent, DeleteComponent} from './components/index';
import { GeoExplorerComponent } from './components/geo-explorer/geo-explorer.component';
import { GeoExplorerService } from './services';

@NgModule({
  imports: [
    CommonModule,
    AnnouncementRoutingModule,
    SharedModule, FormsModule,
    SuiModule
  ],
  declarations: [OutboxComponent, DeleteComponent, GeoExplorerComponent],
  providers: [AnnouncementService, ResourceService, PaginationService, ToasterService, GeoExplorerService]
})
export class AnnouncementModule { }
