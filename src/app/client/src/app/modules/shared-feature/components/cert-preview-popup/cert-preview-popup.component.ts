import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-cert-preview-popup',
  templateUrl: './cert-preview-popup.component.html',
  styleUrls: ['./cert-preview-popup.component.scss']
})
export class CertPreviewPopupComponent implements OnInit {

  @Input() template;
  @Output() close = new EventEmitter();
  @ViewChild('modal', {static: false}) modal;

  constructor(public resourceService: ResourceService,
    private sanitizer: DomSanitizer) { }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
   this.modal.deny();
  }

  ngOnInit() {
  }

  closeModal(name?) {
    if (this.modal) {
      this.modal.deny();
    }
    this.close.emit({name, template: this.template});
  }

  certTemplateURL(url) {
    if (url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
}
