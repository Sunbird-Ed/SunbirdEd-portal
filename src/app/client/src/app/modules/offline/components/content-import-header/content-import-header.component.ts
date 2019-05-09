import { Component } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
    selector: 'app-content-import-header',
    templateUrl: './content-import-header.component.html',
    styleUrls: ['./content-import-header.component.scss']
})
export class ContentImportHeaderComponent {
    showImportModal = false;

    constructor(public resourceService: ResourceService) { }

}
