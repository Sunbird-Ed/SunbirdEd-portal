import { LocationStrategy } from '@angular/common';
import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
export interface editData {
    title?: String,
    subTitle?: String
    defaultValue?: String
    leftBtnText?: String,
    rightBtnText?: String,
    action: String,
    returnParams:any
}
@Component({
    selector: 'app-edit-submission',
    templateUrl: './edit-submission.component.html',
    styleUrls: ['./edit-submission.component.scss'],
})

export class EditSubmissionComponent implements OnInit {
    @ViewChild('modal') modal;
    @Input() editData:editData
    @Output() onAction = new EventEmitter<any>();
    showPopup;
    updatedValue:String
    constructor(
        public location: LocationStrategy,
    ) { 
        this.location.onPopState(() => {
            this.modal.deny();
        });
    }
    ngOnInit() {
        if (this.editData.defaultValue) this.updatedValue = this.editData.defaultValue
    }

    closeModal() {
        this.modal.deny();
        this.onAction.emit({ action: this.editData.action, data: null });
    }
    submit() {
        this.modal.approve();
        this.onAction.emit({ action: this.editData.action, data: this.updatedValue,returnParams:this.editData.returnParams });
    }
}
