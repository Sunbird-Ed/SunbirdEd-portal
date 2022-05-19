import { LocationStrategy } from '@angular/common';
import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
export interface Editdata {
    title?: string;
    subTitle?: string;
    defaultValue?: string;
    leftBtnText?: string;
    rightBtnText?: string;
    action: string;
    returnParams: any;
}
@Component({
    selector: 'app-edit-submission',
    templateUrl: './edit-submission.component.html',
    styleUrls: ['./edit-submission.component.scss'],
})

export class EditSubmissionComponent implements OnInit {
    @ViewChild('modal') modal;
    @Input() editData: Editdata;
    @Output() onAction = new EventEmitter<any>();
    showPopup;
    updatedValue: string;
    constructor(
        public location: LocationStrategy,
    ) {
        this.location.onPopState(() => {
            if(this.modal && this.modal.deny){
                this.modal.deny();
            }
        });
    }
    ngOnInit() {
        if (this.editData.defaultValue) { this.updatedValue = this.editData.defaultValue; }
    }

    closeModal() {
        if(this.modal && this.modal.deny){
            this.modal.deny();
        }
        this.onAction.emit({ action: this.editData.action, data: null });
    }
    submit() {
        if(this.modal && this.modal.deny){
            this.modal.deny();
        }
        this.onAction.emit({ action: this.editData.action, data: this.updatedValue, returnParams: this.editData.returnParams });
    }
}
