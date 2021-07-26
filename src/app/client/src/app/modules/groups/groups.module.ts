import { TelemetryModule } from '@sunbird/telemetry';
import { GroupsRoutingModule } from './groups-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunbird/shared';
import { SuiModule, SuiModalModule, SuiRatingModule } from 'ng2-semantic-ui-v9';
import { NgInviewModule } from 'angular-inport';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MyGroupsComponent, AddMemberComponent, GroupHeaderComponent, NoGroupResultComponent,
  AddActivityComponent, MemberActionsComponent, GroupMembersComponent, FtuPopupComponent,
  BackButtonComponent, ActivityListComponent, ActivityDashboardComponent, ActivitySearchComponent,
  GroupDetailsComponent, ActivityFormComponent, CreateEditGroupComponent, AddActivityContentTypesComponent,
  PopupComponent
} from './components';
import { CoreModule } from '@sunbird/core';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { GroupsService } from './services';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v9';
import { CsLibInitializerService } from '../../service/CsLibInitializer/cs-lib-initializer.service';
import { ContentSearchModule } from '@sunbird/content-search';
import { SlickModule } from 'ngx-slick';
import { RecaptchaModule } from 'ng-recaptcha';
import { DiscussionModule } from '../discussion/discussion.module';
import { ActivityDetailsComponent } from './components/activity/activity-details/activity-details.component';
import { CsEventServiceImpl } from '@project-sunbird/client-services/event/implementation/event-service-impl';
import { CsAppEvents } from '@project-sunbird/client-services/event/interfaces/cs-app-events';

import { IErrorEventInput, TelemetryService } from '../telemetry';
import * as _ from 'lodash-es';
import { Subscription } from 'rxjs';
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
    DiscussionModule,
    SharedFeatureModule
  ],
  providers: [GroupsService],
  declarations: [MyGroupsComponent, AddMemberComponent,
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
  ]
})

export class GroupsModule {
  subscription: Subscription;

  constructor(private csLibInitializerService: CsLibInitializerService,
    private telemetryService: TelemetryService,
    private groupService: GroupsService) {

    this.csLibInitializerService.initializeCs();

    // calling the CsEventServiceImpl from csl to get an data from error events, whenever the error gets triggred by the httpServiceImpl
    this.subscription = CsEventServiceImpl.events(CsAppEvents.ERROR).subscribe(errorEvent => {
      // getting the telemetry context object (object, context, cdata) by calling the getTelemetryContext()
      const routeData = this.groupService.getTelemetryContext();
      const telemetryErrorData: IErrorEventInput = {
        context: routeData.context,
        object: routeData.Object,
        // cdata: routerData.cdata, // Info: currently cdata is not present in the IErrorEventInput interface
        edata: errorEvent.data.edata,
      };
      //passing the data to telemetryService error method to log the error events
      this.telemetryService.error(telemetryErrorData);
      console.log('err', errorEvent);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
