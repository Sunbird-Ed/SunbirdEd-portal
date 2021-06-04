import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigService, ResourceService } from '@sunbird/shared';

@Component({
    selector: 'submission',
    templateUrl: './submission.component.html',
    styleUrls: ['./submission.component.scss']
})
export class SubmissionsComponent implements OnInit {
    @Input() submission;
    @Input() allowMultipleAssessemts;
    showPopOver = true;
    @Output() selectedSubmission = new EventEmitter();
    @Output() onAction = new EventEmitter();
    actions = [{
        name: this.resourceService.frmelmnts.lbl.edit,
        icon: 'pencil alternate large icon',
        type: 'edit'
    },
    {
        name: this.resourceService.frmelmnts.lbl.delete,
        icon: 'trash  large icon',
        type: 'delete'
    }]
    constructor(
        public resourceService: ResourceService,
    ) { }
    ngOnInit() { }

    open(sbnum,data) {
        data.submissionNumber = sbnum;
        this.selectedSubmission.emit(data);
    }
    actionEvent(data, type) {
        this.onAction.emit({action:type,data:data})
    }
}