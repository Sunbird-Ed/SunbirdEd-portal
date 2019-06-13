import { IInteractEventEdata} from '@sunbird/telemetry';
import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';

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
    constructor(public resourceService: ResourceService) { }

    ngOnInit() {
        this.setInteractData();
        this.instance = _.upperCase(this.resourceService.instance);

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
