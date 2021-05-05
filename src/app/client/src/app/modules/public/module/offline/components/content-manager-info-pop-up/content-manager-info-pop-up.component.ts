import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-manager-info-pop-up',
  templateUrl: './content-manager-info-pop-up.component.html',
  styleUrls: ['./content-manager-info-pop-up.component.scss']
})
export class ContentManagerInfoPopUpComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal;
  @Input() failedList;
  @Input() showContentChangeWarning: boolean;
  @Input() drives: any;
  @Output() dismissed = new EventEmitter<any>();
  @Output() submit = new EventEmitter<any>();

  selectedDrive: string;
  popupInteractEdata: IInteractEventEdata;
  constructor(public resourceService: ResourceService, public router: Router) { }

  ngOnInit() {
    this.setPopupInteractEdata();
  }

  closeModal(selectedDrive?: string) {
    this.modal.deny();
    this.dismissed.emit({ selectedDrive: selectedDrive });
  }

  getDriveSelectInteractEdata(selectedDrive) {
    const selectDriveInteractEdata: IInteractEventEdata = {
      id: 'content-location-select-button',
      type: 'click',
      pageid: this.router.url.split('/')[1] || 'library'
    };

    /* istanbul ignore else*/
    if (selectedDrive) {
      selectDriveInteractEdata['extra'] = {
        drive: selectedDrive.name
      };
    }

    return selectDriveInteractEdata;
  }

  setPopupInteractEdata() {
    this.popupInteractEdata = {
      id: 'low-disk-space-warning-popup-close-button',
      type: 'click',
      pageid: this.router.url.split('/')[1] || 'library'
    };
  }
}
