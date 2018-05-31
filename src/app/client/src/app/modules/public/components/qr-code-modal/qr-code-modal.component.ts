import { Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-qr-code-modal',
  templateUrl: './qr-code-modal.component.html',
  styleUrls: ['./qr-code-modal.component.css']
})
export class QrCodeModalComponent implements OnInit {
  @ViewChild('modal') modal;
  constructor(public router: Router) { }

  ngOnInit() {
  }

  onSubmit(dialCodeVal) {
    const dialCode = _.trim(dialCodeVal);
    if (!_.isEmpty(dialCode)) {
      this.modal.approve();
      this.router.navigate(['/get/dial/', dialCode]);
    }
  }
}

