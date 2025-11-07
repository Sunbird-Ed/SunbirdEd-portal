import { TelemetryModule } from '@sunbird/telemetry';
import { GroupsRoutingModule } from './groups-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunbird/shared';
import { SuiModule, SuiModalModule, SuiRatingModule } from '@project-sunbird/ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyGroupsComponent, AddMemberComponent, GroupHeaderComponent, NoGroupResultComponent,
  AddActivityComponent, MemberActionsComponent, GroupMembersComponent, FtuPopupComponent,
  BackButtonComponent, ActivityListComponent, ActivityDashboardComponent, ActivitySearchComponent,
  GroupDetailsComponent, ActivityFormComponent, CreateEditGroupComponent, AddActivityContentTypesComponent,
  PopupComponent } from './components';
import { CoreModule } from '@sunbird/core';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { CsLibInitializerService } from '../../service/CsLibInitializer/cs-lib-initializer.service';
import { ContentSearchModule } from '@sunbird/content-search';
import { RecaptchaModule } from 'ng-recaptcha';
import { DiscussionModule } from '../discussion/discussion.module';
import { ActivityDetailsComponent } from './components/activity/activity-details/activity-details.component';
import { ActivityDashboardDirective } from './directive/activity-dashboard/activity-dashbord.directive';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SuiModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule,
    TelemetryModule,
    SharedFeatureModule,
    GroupsRoutingModule,
    CommonConsumptionModule,
    ContentSearchModule,
    SuiModalModule,
    SuiRatingModule,
    RecaptchaModule,
    DiscussionModule,
    SharedFeatureModule
  ],
  declarations: [ MyGroupsComponent, AddMemberComponent,
    GroupHeaderComponent, NoGroupResultComponent,
    AddActivityComponent, MemberActionsComponent, GroupMembersComponent, FtuPopupComponent,
    BackButtonComponent,
    ActivityListComponent,
    ActivityDashboardComponent,
    ActivitySearchComponent,
    ActivityFormComponent,
    CreateEditGroupComponent,
    GroupDetailsComponent,
    AddActivityContentTypesComponent,
    PopupComponent,
    ActivityDetailsComponent,
    ActivityDashboardDirective
    ],
    exports: [ActivityDashboardDirective]
})
export class GroupsModule {
  constructor(private csLibInitializerService: CsLibInitializerService) {
    this.csLibInitializerService.initializeCs();
  }
 }
