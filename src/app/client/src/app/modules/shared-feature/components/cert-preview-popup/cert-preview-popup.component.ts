import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
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
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (this.modal) {
      this.modal.deny();
    }
  }

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
