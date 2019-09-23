import { IInteractEventEdata} from '@sunbird/telemetry';
import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-content-import-header',
    templateUrl: './content-import-header.component.html',
    styleUrls: ['./content-import-header.component.scss']
})
export class ContentImportHeaderComponent implements OnInit {
    showImportModal = false;
    showVideoModal = false;
    ContentImportIntractEdata: IInteractEventEdata;
    WatchVideoIntractEdata: IInteractEventEdata;
    instance: string;
    appMode = (<HTMLInputElement>document.getElementById('appMode')) ?
    (<HTMLInputElement>document.getElementById('appMode')).value : 'STANDALONE';
    constructor(public resourceService: ResourceService, private http: HttpClient) { }

    ngOnInit() {
        this.setInteractData();
        this.instance = _.upperCase(this.resourceService.instance);
    }
    handleImport() {
        if (this.appMode === 'STANDALONE') {
            this.http.get('/dialog/import/content').subscribe(data => {
                console.log('import dialog box shown');
            }, error => {
                console.log('error while showing import dialog box');
            });
        } else {
            this.showImportModal = true;
        }

    }
    setInteractData() {
        this.ContentImportIntractEdata = {
            id: 'content-import-button',
            type: 'click',
            pageid: 'library'
        };
        this.WatchVideoIntractEdata = {
            id: 'watch-video-button',
            type: 'click',
            pageid: 'library'
        };
    }
}
