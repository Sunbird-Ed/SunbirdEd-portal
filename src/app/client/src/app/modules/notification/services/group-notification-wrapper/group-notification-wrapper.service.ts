import { Injectable } from '@angular/core';
import { ToasterService, ResourceService, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { CsModule } from '@project-sunbird/client-services';
import * as _ from 'lodash-es';
import { delay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GroupNotificationWrapperService {
  groupCservice: any;

  constructor(
    private toasterService: ToasterService,
    private resourceService: ResourceService,
    private configService: ConfigService,
    public router: Router,
    public navigationHelperService: NavigationHelperService
  ) {
    this.groupCservice = CsModule.instance.groupService;
  }

  /**
   * @description - decide wheather the notification will redirect to group-detial or activity-toc-page
   * @param  {} data
   * @param  {} additionalInfo
   */
  navigateNotification(data, additionalInfo) {
    const type = _.get(data, 'data.action.type');
    if (type === 'member-added' || type === 'member-exit' || type === 'group-activity-removed') {
      return ({ path: `my-groups/group-details/` + _.get(additionalInfo, 'group.id') });
    }
    if (type === 'group-activity-added') {
      const isAdmin = _.get(additionalInfo, 'groupRole') === 'admin' ? true : false
      this.navigateToActivityToc(additionalInfo.activity, _.get(additionalInfo, 'group.id'), isAdmin);
    }
    return {};
  }
  /**
   * @description - will redirect to activity toc page based on the activity type
   * @param  {} activity
   * @param  {} groupId
   * @param  {} isAdmin
   */
  navigateToActivityToc(activity, groupId, isAdmin) {
    this.getGroupById(groupId, true, true, true).subscribe((groupData) => {
      const response = this.groupContentsByActivityType(false, groupData);
      response.activities[activity.type].forEach(Selectedactivity => {
        if (activity.id === Selectedactivity.identifier) {
          this.playContent(Selectedactivity, { groupId: groupId, isAdmin: isAdmin });
        }
      })
    }, e => {
      this.toasterService.error('Something went wrong, please try again later')
    });
  }

  /**
   * @description -  To get groupData from csService
   * @param  {string} groupId
   * @param  {boolean} includeMembers?
   * @param  {boolean} includeActivities?
   * @param  {boolean} groupActivities?
   */
  getGroupById(groupId: string, includeMembers?: boolean, includeActivities?: boolean, groupActivities?: boolean) {
    const groupData = this.groupCservice.getById(groupId, { includeMembers, includeActivities, groupActivities });
    return groupData;
  }
  /**
   * @description - To get the activity data
   * @param  {} showList
   * @param  {} groupData
   */
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
  /**
   * @description - will do the redirection for activity toc based on activity type
   * @param  {} content
   * @param  {} queryParams?
   */
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

  /**
   * @param  {} content
   * @param  {} isTrackable
   * @param  {} queryParams?
   */
  handleNavigation(content, isTrackable, queryParams?) {
    if (!isTrackable) {
      this.router.navigate(['/resources/play/collection', content.courseId || content.identifier],
        { queryParams: { contentType: content.contentType } });
    } else if (content.batchId) {
      this.router.navigate(['/learn/course', content.courseId || content.identifier, 'batch', content.batchId],
        { queryParams });
    } else {
      this.router.navigate(['/learn/course', content.identifier], { queryParams });
    }
  }
}