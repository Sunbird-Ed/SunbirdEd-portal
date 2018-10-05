import {
  Component, OnInit, Input, EventEmitter, Output, OnChanges
} from '@angular/core';
import { ResourceService } from '../../services/index';
import * as _ from 'lodash';
import { ContentData, ContentCreditsData } from '@sunbird/shared';

@Component({
  selector: 'app-content-credits',
  templateUrl: './content-credits.component.html'
})
export class ContentCreditsComponent implements OnInit, OnChanges {
   /**
   * To show / hide modal
  */
  showContentCreditModal = false;
  /**
  *input for content credits;
  */
  @Input() contentData: ContentData;
  /**
  *Output for close popup;
  */
  @Output() close = new EventEmitter<any>();
  /**
  * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;

  public contentCreditsData: ContentCreditsData;
  /**
  * Refrence of UserService
  */
  /**
  * Constructor to create injected service(s) object
  *Default method of unpublished Component class
  *@param {ResourceService} SearchService Reference of SearchService
  *@param {WorkSpaceService} WorkSpaceService Reference of SearchService
  */

  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.contentCreditsData = { contributors: '', creators: '' };
    if (this.contentData) {
      const contentCredits = _.get(this.contentData, 'content-credits');
      if (contentCredits && contentCredits.length) {
        const contentCreditNames = _.map(contentCredits, 'name');
        contentCreditNames.push(this.contentData['owner']);
        this.contentCreditsData['contributors'] = _.compact(contentCreditNames).join(', ');
      }
      this.contentCreditsData['creators'] = this.contentData['creator'] || '';
    }
  }

  public closeModal(contentCreditsModal) {
    contentCreditsModal.deny();
    this.close.emit();
  }
}
