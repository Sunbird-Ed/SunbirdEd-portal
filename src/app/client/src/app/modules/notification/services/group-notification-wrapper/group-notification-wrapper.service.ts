import { Injectable } from '@angular/core';
// import { CsGroupSupportedActivitiesFormField } from '@project-sunbird/client-services/services/group/interface';
// import { PlayerService } from '@sunbird/core';
import { ToasterService, ResourceService, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { CsModule } from '@project-sunbird/client-services';
// import { CsGroup } from '@project-sunbird/client-services/models';
import * as _ from 'lodash-es';
import { delay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GroupNotificationWrapperService {
  groupCservice: any;

  constructor(
    // private playerService: PlayerService,
    private toasterService: ToasterService,
    private resourceService: ResourceService,
    private configService: ConfigService,
    public router: Router,
     public navigationHelperService: NavigationHelperService
  ) {
    this.groupCservice = CsModule.instance.groupService;
  }

  navigateNotification(data, additionalInfo, groupCservice) {
    const type = _.get(data, 'data.action.type');
    if (type === 'member-added' || type === 'member-exit' || type === 'group-activity-removed') {
      return {
        path: `my-groups/group-details/` + _.get(additionalInfo, 'group.id'),
      };
    }
    if (type === 'group-activity-added') {
      const isAdmin = _.get(additionalInfo, 'groupRole') === 'admin' ? true : false
      this.navigateToActivityToc(additionalInfo.activity, _.get(additionalInfo, 'group.id'), isAdmin, groupCservice);
    }
    return {};
  }

  navigateToActivityToc(activity, groupId, isAdmin, groupCservice) {
    this.getGroupById(groupId, groupCservice, true, true, true).subscribe((groupData) => {
      const response = this.groupContentsByActivityType(false, groupData);
      response.activities[activity.type].forEach(Selectedactivity => {
        if (activity.id === Selectedactivity.identifier) {
          // this.playerService.playContent(Selectedactivity, { groupId: groupId, isAdmin: isAdmin });
          this.playContent(Selectedactivity, { groupId: groupId, isAdmin: isAdmin });
        }
      })
    }, e => {
      this.toasterService.error('Something went wrong, please try again later')
    });
  }

  // To get groupData from csService
  getGroupById(groupId: string, groupCservice: any, includeMembers?: boolean, includeActivities?: boolean, groupActivities?: boolean) {
    const groupData = groupCservice.getById(groupId, { includeMembers, includeActivities, groupActivities });
    return groupData;
  }

  groupContentsByActivityType(showList, groupData) {
    const activitiesGrouped = _.get(groupData, 'activitiesGrouped');
    if (activitiesGrouped) {

      const activityList = activitiesGrouped.reduce((acc, activityGroup) => {
        activityGroup = this.getSelectedLanguageStrings(activityGroup);

        acc[activityGroup.title] = activityGroup.items.map((i) => {
          const activity = {
            ...i.activityInfo,
            type: i.type,
            cardImg: _.get(i, 'activityInfo.appIcon') || this.configService.appConfig.assetsPath.book,
          };
          return activity;
        });
        showList = !showList ? Object.values(acc).length > 0 : showList;
        return acc;

      }, {});
      Object.keys(activityList).forEach(key => activityList[key].length <= 0 && delete activityList[key]);
      return { showList, activities: activityList };
    }
    return { showList, activities: activitiesGrouped || {} };
  }

  getSelectedLanguageStrings(activity) {
    this.resourceService.languageSelected$.pipe(delay(600)).subscribe(item => {
      if (!_.isEmpty(activity)) {
        if (activity.translations) {
          _.find(JSON.parse(activity.translations), (value, key) => {
            if (item.value === key) {
              activity.title = value;
            }
          });
        }
      }
    });
    return activity;
  }

  playContent(content, queryParams?) {
    this.navigationHelperService.storeResourceCloseUrl();
    setTimeout(() => { // setTimeOut is used to trigger telemetry interact event as changeDetectorRef.detectChanges() not working.
      if (content.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection ||
        _.get(content, 'metaData.mimeType') === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {
          if (!content.trackable && content.primaryCategory !== 'Course') {
            this.handleNavigation(content, false, queryParams);
          } else {
            const isTrackable = content.trackable && content.trackable.enabled === 'No' ? false : true;
            this.handleNavigation(content, isTrackable, queryParams);
          }
      } else if (content.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.ecmlContent) {
        this.router.navigate(['/resources/play/content', content.identifier]);
      } else if (content.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.questionset) {
        this.router.navigate(['/resources/play/questionset', content.identifier]);
      } else {
        this.router.navigate(['/resources/play/content', content.identifier]);
      }
    }, 0);
  }

  handleNavigation(content, isTrackable, queryParams?) {
    if (!isTrackable) {
      this.router.navigate(['/resources/play/collection', content.courseId || content.identifier],
      {queryParams: {contentType: content.contentType}});
    } else if (content.batchId) {
      this.router.navigate(['/learn/course', content.courseId || content.identifier, 'batch', content.batchId],
        { queryParams });
    } else {
      this.router.navigate(['/learn/course', content.identifier], { queryParams });
    }
  }
}
