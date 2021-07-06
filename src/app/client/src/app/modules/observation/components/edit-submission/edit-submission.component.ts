import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
    selector: "app-edit-submission",
    templateUrl: "./edit-submission.component.html",
    styleUrls: ["./edit-submission.component.scss"],
})

export class EditSubmissionComponent implements OnInit {
    @ViewChild('modal', { static: false }) modal;
    @Input() submission;
    @Output() onAction = new EventEmitter<any>();
    showPopup;
    constructor(
        public resourceService: ResourceService,
    ) { }
    ngOnInit() { }

    closeModal() {
        this.modal.deny();
        this.onAction.emit({ action: 'edit', data: {} });
    }
    submit() {
        this.modal.approve();
        this.onAction.emit({ action: 'edit', data: this.submission });
    }
}