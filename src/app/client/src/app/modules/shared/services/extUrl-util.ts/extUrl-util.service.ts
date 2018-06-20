import { ConfigService } from './../config/config.service';
import { ResourceService } from './../resource/resource.service';
import { ToasterService } from './../toaster/toaster.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ExternalUrlpreviewService {
    constructor(public configService: ConfigService, public resourceService: ResourceService,
        public toasterService: ToasterService) { }
    /**
      * getRedirectUrl function is to redirect to the external url link in a new tab
      * @param playerconfigMeta Playerconfig data to get artifacturl and contentId of the item in the player
      * @param courseId course id of the enrolled / playing course
      * @param userId  user id of the loggedin user
      */
    getRedirectUrl(playerconfigMeta: any, userId?: string, courseId?: string, batchId?: string) {
        // if (playerconfigMeta.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.xUrl) {
        this.toasterService.warning(this.resourceService.messages.imsg.m0034);
        setTimeout(() => {
            const newWindow = window.open('/learn/redirect', '_blank');
            newWindow.redirectUrl = playerconfigMeta.artifactUrl + (courseId !== undefined ? '#&courseId=' + courseId : '')
                + '#&contentId=' + playerconfigMeta.identifier + (batchId !== undefined ? '#&batchId=' + batchId : '') + '#&uid=' + userId;
            const extUrlLink = playerconfigMeta.artifactUrl + (courseId !== undefined ? '#&courseId=' + courseId : '') + '#&contentId='
                + playerconfigMeta.identifier + (batchId !== undefined ? '#&batchId=' + batchId : '') +
                (userId !== undefined ? '#&uid=' + userId : '');
        }, 1000);
    }
}
