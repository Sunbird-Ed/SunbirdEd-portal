import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService, PaginationService, ToasterService} from '@sunbird/shared';
import { AnnouncementService} from '@sunbird/core';
import { OutboxComponent, DeleteComponent} from './components/index';
import { GeoExplorerComponent } from './components/geo-explorer/geo-explorer.component';
import { GeoExplorerService, CreateService } from './services';
import { CreateComponent } from './components/create/create.component';
// import { NgForm, FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    AnnouncementRoutingModule,
    SharedModule, FormsModule,
    SuiModule, ReactiveFormsModule
  ],
  declarations: [OutboxComponent, DeleteComponent, GeoExplorerComponent, CreateComponent],
  providers: [AnnouncementService, ResourceService, PaginationService, ToasterService, GeoExplorerService, CreateService]
})
export class AnnouncementModule { }
