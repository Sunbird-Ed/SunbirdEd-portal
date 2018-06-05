import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceService } from '../../services';
import * as _ from 'lodash';

@Component({
  selector: 'app-qr-code-modal',
  templateUrl: './qr-code-modal.component.html',
  styleUrls: ['./qr-code-modal.component.css']
})
export class QrCodeModalComponent implements OnInit {
  @ViewChild('modal') modal;
  @Output() closeQrModal = new EventEmitter<any>();
  constructor(public router: Router, public resourceService: ResourceService) { }

  ngOnInit() {
  }

  onSubmit(dialCodeVal) {
    const dialCode = _.trim(dialCodeVal);
    if (!_.isEmpty(dialCode)) {
      this.modal.approve();
      this.router.navigate(['/get/dial/', dialCode]);
    }
  }

  closeModal() {
    this.closeQrModal.emit('success');
  }
}

