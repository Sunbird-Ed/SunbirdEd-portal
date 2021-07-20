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
import { CsEventService } from '@project-sunbird/client-services/event/implementation/event-service-impl';
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
  constructor(private csLibInitializerService: CsLibInitializerService, private telemetryService: TelemetryService, private groupService: GroupsService) {
    this.csLibInitializerService.initializeCs();
    const instanceOfEService = CsEventService;
    this.subscription = instanceOfEService.events('Error').subscribe(error => {
      const routeData = this.groupService.getTelemetryContext();
      const params = error.data.error.response.body.params;
      if (params) {
        params.errmsg = params.errmsg.length > 50 ? (params.errmsg.substring(0, 50) + '...') : params.errmsg;
      }
      const errRes = error.data.error;
      const telemetryErrorData: IErrorEventInput = {
        context: routeData.context,
        object: routeData.Object,
        // cdata: routerData.cdata, // Info: currently cdata is not present in the IErrorEventInput interface
        edata: {
          err: _.get(params, 'err') || _.get(errRes, 'code'),
          errtype: JSON.stringify(_.get(errRes, 'response.responseCode')) || JSON.stringify(_.get(errRes, 'code')),
          traceid: JSON.stringify(_.get(params, 'msgid')) || JSON.stringify(Math.random()),
          stacktrace: _.get(params, 'errmsg') || _.get(errRes, 'response.errorMesg')
        }
      };
      this.telemetryService.error(telemetryErrorData);
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
