import { Injectable } from '@angular/core';
import { ConfigService, NavigationHelperService } from '@sunbird/shared';
import { CsModule } from '@project-fmps/client-services';
import * as _ from 'lodash-es';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GroupNotificationWrapperService {
  groupCservice: any;

  constructor(
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
      const isAdmin = _.get(additionalInfo, 'groupRole') === 'admin' ? true : false;
      this.navigateToActivityToc(additionalInfo.activity, _.get(additionalInfo, 'group.id'), isAdmin, true, true, true);
    }
    return {};
  }

  /**
   * @description - will redirect to activity toc page based on the activity type
   * @param  {} activity
   * @param  {} groupId
   * @param  {} isAdmin
   */
  navigateToActivityToc(activity, groupId, isAdmin, includeMembers?, includeActivities?, groupActivities?) {
    this.groupCservice.getById(groupId, { includeMembers, includeActivities, groupActivities }).subscribe((groupData) => {
      const Selectedactivity = this.groupCservice.getActivityDataById(groupData, activity);
      if (Selectedactivity) {
        this.playContent(Selectedactivity, { groupId: groupId, isAdmin: isAdmin });
      }
    });
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
