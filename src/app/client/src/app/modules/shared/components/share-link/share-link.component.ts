import { Component, OnInit, Input, AfterViewInit,
EventEmitter, ElementRef, Output, ViewChild } from '@angular/core';
import { ResourceService } from '../../services/index';
import { IPopup } from 'ng2-semantic-ui';
import { ISharelink } from './../../interfaces';
@Component({
  selector: 'app-share-link',
  templateUrl: './share-link.component.html',
  styles: [`
    >>> .ui.popup{
      background-color: #007AFF !important;
      background:#007AFF !important
    },
    >>> .arrow{
      background-color: #007AFF !important;
      background:#007AFF !important
    }
  `],
})
export class ShareLinkComponent implements OnInit, AfterViewInit {
  /**
  * position for the popup
  */
  position: string;
  /**
  * contentShareLink
  */
  @Input() contentShareLink: ISharelink;

  @Output() close = new EventEmitter();

  // @ViewChild('copyLinkData') el:ElementRef;
  @ViewChild('copyLinkButton') copyLinkButton: ElementRef;

  /**
  * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;

  /**
  * Refrence of UserService
  */
  /**
  * Constructor to create injected service(s) object
  *Default method of unpublished Component class
  *@param {ResourceService} SearchService Reference of SearchService
  *@param {WorkSpaceService} WorkSpaceService Reference of SearchService
  */
  constructor(resourceService: ResourceService ) {
    this.resourceService = resourceService;
    this.position = 'top';
  }
  ngOnInit() {
    console.log('>>>>>>', this.contentShareLink);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.copyLinkButton.nativeElement.click();
    });
  }
  public copyLink(popup: IPopup, copyLinkData) {
    popup.open();
    copyLinkData.select();
    document.execCommand('copy');
  }
  modalDeny(contentShareModal) {
    contentShareModal.deny();
    this.close.emit(null);
  }

  initializeModal(contentShareModal) {
    contentShareModal.open();
  }
}
