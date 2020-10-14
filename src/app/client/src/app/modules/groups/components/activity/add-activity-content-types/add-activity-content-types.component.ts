import { Component, OnInit, AfterViewInit , OnDestroy} from '@angular/core';
import { GroupsService } from '../../../services';
import { ResourceService, ToasterService, NavigationHelperService, LayoutService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { ADD_ACTIVITY_TO_GROUP } from '../../../interfaces';
import { CsGroupAddableBloc } from '@project-sunbird/client-services/blocs';
import { CsGroupSupportedActivitiesFormField } from '@project-sunbird/client-services/services/group/interface';
import { TelemetryService, IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';



@Component({
  selector: 'app-add-activity-content-types',
  templateUrl: './add-activity-content-types.component.html',
  styleUrls: ['./add-activity-content-types.component.scss']
})
export class AddActivityContentTypesComponent implements OnInit, AfterViewInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  public supportedActivityList;
  public groupName: string;
  public groupCreator: string;
  private csGroupAddableBloc: CsGroupAddableBloc;
  public telemetryImpression: IImpressionEventInput;
  public layoutConfiguration: any;
  public showLoader = true;

  constructor(
    public groupService: GroupsService,
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public navigationHelperService: NavigationHelperService,
    private telemetryService: TelemetryService,
    public layoutService: LayoutService
  ) {
    this.csGroupAddableBloc = CsGroupAddableBloc.instance;
   }

  ngOnInit() {
    this.navigationHelperService.setNavigationUrl();
    if (!this.csGroupAddableBloc.initialised) {
      this.csGroupAddableBloc.init();
    }
    this.activatedRoute.queryParams.subscribe((params) => {
     this.groupName = _.get(params, 'groupName');
     this.groupCreator = _.get(params, 'createdBy');
    });
    this.fetchActivityList();
    this.initLayout();
  }

  ngAfterViewInit() {
    this.setTelemetryImpressionData();
  }

  fetchActivityList() {
    this.groupService.getSupportedActivityList().subscribe( data => {
      this.showLoader = false;
      this.supportedActivityList = _.get(data, 'data.fields');
      this.supportedActivityList.forEach(activity => {
        activity = this.groupService.getSelectedLanguageStrings(activity);
      });
    }, (error) => {
      this.showLoader = false;
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }

  onCardClick(cardData: CsGroupSupportedActivitiesFormField) {
    this.csGroupAddableBloc.updateState({
      pageIds: [cardData.activityType.toLowerCase(), ADD_ACTIVITY_TO_GROUP],
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
        cdata: [{
          type: 'Group',
          id: _.get(this.groupService, 'groupData.id')
        }]
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
        cdata: [{
          type: 'Group',
          id: _.get(this.groupService, 'groupData.id')
        }]
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

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
