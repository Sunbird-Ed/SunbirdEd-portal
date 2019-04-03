import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceService } from '../../services';
import * as _ from 'lodash';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
@Component({
  selector: 'app-qr-code-modal',
  templateUrl: './qr-code-modal.component.html'
})
export class QrCodeModalComponent implements OnInit {
  @ViewChild('modal') modal;
  @Output() closeQrModal = new EventEmitter<any>();
  public submitDialCodeInteractEdata: IInteractEventEdata;
  public closeDialCodeInteractEdata: IInteractEventEdata;
  constructor(public router: Router, public resourceService: ResourceService) { }

  ngOnInit() {
    this.setInteractEventData();
  }
  setInteractEventData() {
    this.closeDialCodeInteractEdata = {
      id: 'close-dial-code',
      type: 'click',
      pageid: 'explore'
    };
  }

  onSubmit(dialCodeVal) {
    const dialCode = _.trim(dialCodeVal);
    if (!_.isEmpty(dialCode)) {
      this.setsubmitDialCodeInteractEdata(dialCodeVal);
      this.modal.approve();
      this.router.navigate(['/get/dial/', dialCode]);
    }
  }

  setsubmitDialCodeInteractEdata(dialCode) {
    this.submitDialCodeInteractEdata = {
      id: 'submit-dial-code',
      type: 'submit',
      pageid: 'explore',
    };
    if (!_.isEmpty(dialCode)) {
      this.submitDialCodeInteractEdata.extra = {'dialCode': dialCode };
    }
    return this.submitDialCodeInteractEdata;
  }
  closeModal() {
    this.closeQrModal.emit('success');
  }
}

