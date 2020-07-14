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
  GroupDetailsComponent, ActivityFormComponent, CreateEditGroupComponent } from './components';
import { CoreModule } from '@sunbird/core';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { GroupsService } from './services';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { CsLibInitializerService } from '../../service/CsLibInitializer/cs-lib-initializer.service';
import { ContentSearchModule } from '@sunbird/content-search';
import { SlickModule } from 'ngx-slick';
import { RecaptchaModule } from 'ng-recaptcha';

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
    RecaptchaModule
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
    GroupDetailsComponent]
})
export class GroupsModule {
  constructor(private csLibInitializerService: CsLibInitializerService) {
    this.csLibInitializerService.initializeCs();
  }
 }
