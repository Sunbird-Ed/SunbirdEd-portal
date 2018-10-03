import {
  Component, OnInit, Input, EventEmitter, Output, OnChanges
} from '@angular/core';
import { ResourceService } from '../../services/index';
import * as _ from 'lodash';

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
  @Input() contentData: object;
  /**
  *Output for close popup;
  */
  @Output() close = new EventEmitter<any>();
  /**
  * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;

  public contentCreditsData: object;
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
    this.contentCreditsData = { contributors: '', creators: ''};
    if (this.contentData) {
      const contentCredits = _.get(this.contentData, 'content-credits');
      if (contentCredits && contentCredits.length) {
        this.contentCreditsData['contributors'] = _.toString( _.map(contentCredits, 'name'));
      }
      if (this.contentData && this.contentData['owner']) {
        this.contentCreditsData['contributors'] += (this.contentCreditsData['contributors'] ? ',' : '') + this.contentData['owner'];
      }
      if (this.contentData && this.contentData['creator']) {
        this.contentCreditsData['creators'] = this.contentData['creator'];
      }
    }
  }

  public closeModal(contentCreditsModal) {
    contentCreditsModal.deny();
    this.close.emit();
  }
}
