import { TelemetryModule } from '@sunbird/telemetry';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService, PaginationService, ToasterService, RouterNavigationService} from '@sunbird/shared';
import { AnnouncementService} from '@sunbird/core';
import { NgInviewModule } from 'angular-inport';
import { OutboxComponent, DeleteComponent, DetailsComponent, GeoExplorerComponent,
  DetailsPopupComponent, InboxComponent, CreateComponent, FileUploaderComponent } from './components';
  import { GeoExplorerService, CreateService } from './services';
@NgModule({
  imports: [
    CommonModule,
    AnnouncementRoutingModule,
    SharedModule, FormsModule,
    SuiModule, ReactiveFormsModule,
    TelemetryModule,
    NgInviewModule
  ],
  declarations: [OutboxComponent, DeleteComponent, DetailsComponent, GeoExplorerComponent, DetailsPopupComponent, InboxComponent,
     CreateComponent, FileUploaderComponent],
  providers: [AnnouncementService, ResourceService, PaginationService, ToasterService, GeoExplorerService,
     RouterNavigationService, CreateService]
})
export class AnnouncementModule { }
