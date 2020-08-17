import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-cert-preview-popup',
  templateUrl: './cert-preview-popup.component.html',
  styleUrls: ['./cert-preview-popup.component.scss']
})
export class CertPreviewPopupComponent implements OnInit {

  @Input() template;
  @Output() close = new EventEmitter();
  @ViewChild('modal') modal;
  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
  }

  closeModal(name?) {
    if (this.modal) {
      this.modal.deny();
    }
    this.close.emit({name, template: this.template});
  }
}
