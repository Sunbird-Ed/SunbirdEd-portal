import { TelemetryModule } from '@sunbird/telemetry';
import { GroupsRoutingModule } from './groups-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { NgInviewModule } from 'angular-inport';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyGroupsComponent, AddMemberComponent,
  GroupFormComponent, GroupHeaderComponent, GroupWorkspaceComponent, DeletePopupComponent,
  NoGroupResultComponent} from './components';
import { CoreModule } from '@sunbird/core';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { GroupsService } from './services';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SuiModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule,
    TelemetryModule,
    NgInviewModule,
    SharedFeatureModule,
    GroupsRoutingModule,
    CommonConsumptionModule
  ],
  providers: [GroupsService],
  declarations: [ MyGroupsComponent, AddMemberComponent,
    GroupFormComponent, GroupHeaderComponent, GroupWorkspaceComponent, DeletePopupComponent, NoGroupResultComponent, ]
})
export class GroupsModule { }
