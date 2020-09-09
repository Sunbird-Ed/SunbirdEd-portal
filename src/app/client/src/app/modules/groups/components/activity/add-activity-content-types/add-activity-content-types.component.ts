import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GroupsService } from '../../../services';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { ADD_ACTIVITY_TO_GROUP, IGroupData } from '../../../interfaces';
import { CsGroupAddableBloc } from '@project-sunbird/client-services/blocs';
import { CsGroupSupportedActivitiesFormField } from '@project-sunbird/client-services/services/group/interface';
import { TelemetryService, IImpressionEventInput } from '@sunbird/telemetry';


@Component({
  selector: 'app-add-activity-content-types',
  templateUrl: './add-activity-content-types.component.html',
  styleUrls: ['./add-activity-content-types.component.scss']
})
export class AddActivityContentTypesComponent implements OnInit, AfterViewInit {

  public supportedActivityList;
  public groupData: IGroupData;
  private csGroupAddableBloc: CsGroupAddableBloc;
  telemetryImpression: IImpressionEventInput;

  constructor(
    public groupService: GroupsService,
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public navigationHelperService: NavigationHelperService,
    private telemetryService: TelemetryService
  ) {
    this.csGroupAddableBloc = CsGroupAddableBloc.instance;
   }

  ngOnInit() {
    this.navigationHelperService.setNavigationUrl();
    if (!this.csGroupAddableBloc.initialised) {
      this.csGroupAddableBloc.init();
    }
    this.fetchActivityList();
    this.activatedRoute.queryParams.subscribe((params) => {
     this.groupData['name'] = _.get(params, 'groupName');
     this.groupData['creator'] = _.get(params, 'createdBy');
     this.groupData['groupId'] = _.get(params, 'groupId');
    });
  }

  ngAfterViewInit() {
    this.setTelemetryImpressionData();
  }

  fetchActivityList() {
    this.groupService.getSupportedActivityList().subscribe( data => {
      this.supportedActivityList = _.get(data, 'data.fields');
      this.supportedActivityList.forEach(activity => {
        activity['title'] = this.resourceService.frmelmnts.lbl[activity['title']];
      });
    });
  }

  onCardClick(cardData: CsGroupSupportedActivitiesFormField) {
    this.csGroupAddableBloc.updateState({
      pageIds: [cardData.activityType.toLowerCase()],
      groupId: _.get(this.groupService, 'groupData.id'),
      params: {
        searchQuery: cardData.searchQuery,
        groupData: _.get(this.groupService, 'groupData'),
        contentType: cardData.activityType
      }
    });
    this.sendInteractData({id: `${cardData.activityType}-card`});
    this.router.navigate([`${ADD_ACTIVITY_TO_GROUP}`, cardData.activityType , 1], { relativeTo: this.activatedRoute });
  }

  sendInteractData(interactData) {
    const data = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: []
      },
      edata: {
        id: _.get(interactData, 'id'),
        type: 'CLICK',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      }
    };

    this.telemetryService.interact(data);
  }

  setTelemetryImpressionData() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: []
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        duration: this.navigationHelperService.getPageLoadTime()
      }
    };
    this.telemetryService.impression(this.telemetryImpression);
  }

}
