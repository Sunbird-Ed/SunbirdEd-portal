import { TelemetryModule } from '@sunbird/telemetry';
import { GroupsRoutingModule } from './groups-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunbird/shared';
import { SuiModule, SuiModalModule, SuiRatingModule } from 'ng2-semantic-ui/dist';
import { NgInviewModule } from 'angular-inport';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyGroupsComponent, AddMemberComponent, GroupHeaderComponent, NoGroupResultComponent,
  AddActivityComponent, MemberActionsComponent, GroupMembersComponent, FtuPopupComponent,
  BackButtonComponent, ActivityListComponent, ActivityDashboardComponent, ActivitySearchComponent,
  GroupDetailsComponent, ActivityFormComponent, CreateEditGroupComponent, AddActivityContentTypesComponent,
  PopupComponent } from './components';
import { CoreModule } from '@sunbird/core';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { GroupsService } from './services';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { CsLibInitializerService } from '../../service/CsLibInitializer/cs-lib-initializer.service';
import { ContentSearchModule } from '@sunbird/content-search';
import { SlickModule } from 'ngx-slick';
import { RecaptchaModule } from 'ng-recaptcha';
import { DiscussionModule } from '../discussion/discussion.module';

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
    ContentSearchModule,
    SlickModule,
    SuiModalModule,
    SuiRatingModule,
    RecaptchaModule,
    DiscussionModule
  ],
  providers: [GroupsService],
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
    PopupComponent]
})
export class GroupsModule {
  constructor(private csLibInitializerService: CsLibInitializerService) {
    this.csLibInitializerService.initializeCs();
  }
 }
