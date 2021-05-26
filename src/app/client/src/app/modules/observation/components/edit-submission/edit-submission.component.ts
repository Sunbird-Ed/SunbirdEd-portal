import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { ConfigService, ResourceService, ILoaderMessage, INoResultMessage } from '@sunbird/shared';

@Component({
    selector: "app-edit-submission",
    templateUrl: "./edit-submission.component.html",
    styleUrls: ["./edit-submission.component.scss"],
})

export class EditSubmissionComponent implements OnInit {
    @ViewChild('modal', { static: false }) modal;
    @Input() submission;
    @Output() closeEvent = new EventEmitter<any>();
    @Output() editEvent = new EventEmitter<any>();
    
    data;
    constructor(
        public resourceService: ResourceService,
    ) { }
    ngOnInit() {
        this.data = JSON.parse(JSON.stringify(this.submission));
    }

    closeModal() {
        this.modal.deny();
        this.closeEvent.emit();
    }
    submit() {
        this.modal.approve();
        this.editEvent.emit(this.data);
    }
}