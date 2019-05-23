import { IInteractEventEdata} from '@sunbird/telemetry';
import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

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

    constructor(public resourceService: ResourceService) { }

    ngOnInit() {
        this.setInteractData();
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
