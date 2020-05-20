import { TelemetryModule } from '@sunbird/telemetry';
import { GroupsRoutingModule } from './groups-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { SharedModule } from '@sunbird/shared';
import { SuiModule, SuiModalModule } from 'ng2-semantic-ui/dist';
import { NgInviewModule } from 'angular-inport';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyGroupsComponent, CreateGroupComponent, AddMemberComponent,
  GroupFormComponent, GroupHeaderComponent, GroupWorkspaceComponent, GroupActionsComponent,
  MemberActionsComponent, NoGroupResultComponent} from './components';
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
    CommonConsumptionModule,
    SuiModalModule
  ],
  providers: [GroupsService],
  declarations: [ MyGroupsComponent, CreateGroupComponent, AddMemberComponent,
    GroupFormComponent, GroupHeaderComponent, GroupWorkspaceComponent,
    NoGroupResultComponent, GroupActionsComponent, MemberActionsComponent, ]
})
export class GroupsModule { }
