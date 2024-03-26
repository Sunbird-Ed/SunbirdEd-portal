import { IShareEventData } from '@sunbird/telemetry';
import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ResourceService } from '../../services/index';
import { IPopup } from '@project-sunbird/ng2-semantic-ui';
import { ITelemetryShare } from './../../interfaces';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-share-link',
  templateUrl: './share-link.component.html',
  styleUrls: ['./share-link.component.scss']
})
export class ShareLinkComponent implements OnInit {
  /**
  * position for the popup
  */
  position: string;
  /**
  *baseUrl;
  */
  public baseUrl: string;
  telemetryShare: IShareEventData;
  /**
  *input for Sharelink;
  */
  @Input() shareLink: string;
  /**
  *input for telemetryShare;
  */
  @Input() telemetryShareData: Array<ITelemetryShare> = [];
  @Input() telemetryInteractEdata = {
    id: 'content-share-link-btn',
    type: 'click',
    pageid: this.activatedRoute.snapshot.data.telemetry.env
  };
  /**
  *Element Ref  for copyLinkButton;
  */
  @ViewChild('copyLinkButton') copyLinkButton: ElementRef;
  /**
  *Element Ref  for copyLinkData;
  */
  // @ViewChild('copyLinkData') copyLinkData: ElementRef;
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
  constructor(resourceService: ResourceService, private _renderer: Renderer2, public activatedRoute: ActivatedRoute) {
    this.resourceService = resourceService;
    this.position = 'top center';
    this.baseUrl = document.location.origin + '/';
  }
  ngOnInit() {
    this.initializeModal();
  }
  /**
  * initializeModal
  */
  initializeModal() {
    setTimeout(() => {
      this.copyLinkButton && this.copyLinkButton.nativeElement.click();
    }, 300);
    this.telemetryShare = {
      type: 'Link',
      dir: 'out',
      items: this.telemetryShareData
    };
  }
  /**
  * copyLink
  * {object}  copyLinkData -element ref
  * {object}  popup -element ref
  */
  public copyLink(popup: IPopup) {
    popup.open();
    $('#copyLinkData').select();
    document.execCommand('copy');
  }
}
