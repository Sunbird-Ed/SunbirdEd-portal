import {
  Component, OnInit, Input, EventEmitter,
  ElementRef, ViewChild, Renderer
} from '@angular/core';
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
    }
    >>> .arrow{
      background-color: #007AFF !important;
      background:#007AFF !important
    }
  `],
})
export class ShareLinkComponent implements OnInit {
  /**
  * position for the popup
  */
  position: string;
  /**
  * contentShareLink
  */
  ShareLink: string;

  /**
   * To show / hide modal
  */
  sharelinkModal = false;
  /**
  *baseUrl;
  */
  public baseUrl: string;
  /**
  *input for Sharelink;
  */
  @Input() contentShare: ISharelink;
  /**
  *Element Ref  for copyLinkButton;
  */
  @ViewChild('copyLinkButton') copyLinkButton: ElementRef;
  /**
  *Element Ref  for copyLinkData;
  */
  @ViewChild('copyLinkData') copyLinkData: ElementRef;
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
  constructor(resourceService: ResourceService, private _renderer: Renderer) {
    this.resourceService = resourceService;
    this.position = 'top center';
    this.baseUrl = document.location.origin + '/';
  }
  ngOnInit() {
    if (this.contentShare.type) {
      this.ShareLink = this.getPublicShareUrl(this.contentShare.id, this.contentShare.type);
    } else {
      this.ShareLink = this.getUnlistedShareUrl(this.contentShare);
    }
  }
  /**
  * popDenys
  */
  popDeny(pop) {
    pop.close();
  }

  /**
  * initializeModal
  */
  initializeModal() {
    this.sharelinkModal = !this.sharelinkModal;
    if (this.sharelinkModal) {
      setTimeout(() => {
        this.copyLinkButton.nativeElement.click();
      });
    }
  }
  /**
  * copyLink
  * {object}  copyLinkData -element ref
  * {object}  popup -element ref
  */
  public copyLink(popup: IPopup) {
    popup.open();
    setTimeout(() => {
    this._renderer.invokeElementMethod(this.copyLinkData.nativeElement, 'select', []);
    }, 0);
    document.execCommand('copy');
  }
  /**
   * getBase64Url
   * generate the base url to play unlisted content for public users.
   * {object} identifier-content or course identifier
   * returns {string} type - content or course type.
   */
  getBase64Url(type, identifier) {
    return btoa(type + '/' + identifier);
  }
  /**
  * getUnlistedShareUrl
  * generate the url to play unlisted content for other users.
  * {object}  cData - content data
  * returns {string} url to share.
  */
  getUnlistedShareUrl(content) {
    if (content.contentType === 'Course') {
      return this.baseUrl + 'unlisted' + '/' + this.getBase64Url('course', content.identifier);
    } else if (content.mimeType === 'application/vnd.ekstep.content-collection') {
      return this.baseUrl + 'unlisted' + '/' + this.getBase64Url('collection', content.identifier);
    } else {
      return this.baseUrl + 'unlisted' + '/' + this.getBase64Url('content', content.identifier);
    }
  }
  /**
  * getPublicShareUrl
  * {string}  identifier - content or course identifier
  * {string}  type - content or course type
  * returns {string} url to share
  */
  getPublicShareUrl(identifier, type) {
    return this.baseUrl + type + '/' + identifier;
  }
}
