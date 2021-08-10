import { LocationStrategy } from '@angular/common';
import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
export interface Editdata {
    title?: string,
    subTitle?: string
    defaultValue?: string
    leftBtnText?: string,
    rightBtnText?: string,
    action: string,
    returnParams:any
}
@Component({
    selector: 'app-edit-submission',
    templateUrl: './edit-submission.component.html',
    styleUrls: ['./edit-submission.component.scss'],
})

export class EditSubmissionComponent implements OnInit {
    @ViewChild('modal') modal;
    @Input() editData:Editdata
    @Output() onAction = new EventEmitter<any>();
    showPopup;
    updatedValue:string
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
