import { IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
    selector: 'app-content-import-header',
    templateUrl: './content-import-header.component.html',
    styleUrls: ['./content-import-header.component.scss']
})
export class ContentImportHeaderComponent {
    showImportModal = false;
    showVideoModal = false;
    ContentImportIntractEdata: IInteractEventEdata;
    public telemetryInteractObject: IInteractEventObject;

    constructor(public resourceService: ResourceService) { }

}
