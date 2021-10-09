import { Injectable } from '@angular/core';
import { TncService, UserService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { first } from 'rxjs/operators';

export interface ReportViewerTnc {
    version: string;
    url: string;
    showTncPopup: boolean;
}

@Injectable()



export class ReportViewerTncService {
    constructor(
        private tncService: TncService,
        private userService: UserService
    ) { }

    getReportViewerTncPolicy(): Promise<ReportViewerTnc> {
        const reportViewerTnc: ReportViewerTnc = {
            version: '',
            url: '',
            showTncPopup: false
        };
        return new Promise((resolve, reject) => {
            this.tncService.getReportViewerTnc().subscribe(data => {
                const reportViewerTncData = JSON.parse(_.get(data, 'result.response.value'));
                if (_.get(reportViewerTncData, 'latestVersion')) {
                    reportViewerTnc.version = _.get(reportViewerTncData, 'latestVersion');
                    reportViewerTnc.url = _.get(_.get(reportViewerTncData,
                        _.get(reportViewerTncData, 'latestVersion')), 'url');
                    reportViewerTnc.showTncPopup = this.showReportViewerTncForFirstUser();
                }
                resolve(reportViewerTnc);
            }, (error) => {
                reject();
            });
        });
    }

    private showReportViewerTncForFirstUser() {
        let showTncPopup = false;
        this.userService.userData$.pipe(first()).subscribe(async (user) => {
            if (user && user.userProfile) {
                const reportViewerTncObj = _.get(user.userProfile, 'allTncAccepted.reportViewerTnc');
                if (!reportViewerTncObj) {
                    showTncPopup = true;
                }
            }
        });
        return showTncPopup;
    }
}
