import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
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
    this.contentCreditsData = { contributors: '', creators: '', attributions: '', copyright: '' };
    if (this.contentData) {
      if (this.contentData.copyright) {
        this.contentCreditsData['copyright'] = this.contentData.copyright;
      }
      // contributors , it is a combination of content credits names, creators, and owner
      const contentCredits = _.get(this.contentData, 'contentCredits');
      const contentCreditNames = contentCredits && contentCredits.length ? _.map(contentCredits, 'name') : [];
      const contirbutors = this.contentData['contributors'] ? this.contentData['contributors'].split(',') : [];
      if (this.contentData['owner']) {
        contirbutors.push(this.contentData['owner']);
      }
      this.contentCreditsData['contributors'] = (_.compact(_.uniq(_.union(contentCreditNames, contirbutors).sort())).join(', '));
      // creators is a combination of creators and creator
      const creators = this.contentData['creators'] ? this.contentData['creators'].split(',') : [];
      if (this.contentData['creator']) {
        creators.push(this.contentData['creator']);
      }
      // attributors
      const attributions = _.get(this.contentData, 'attributions');
      this.contentCreditsData['attributions'] =
      (_.compact(_.uniq(_.union(contentCreditNames, contirbutors, attributions, creators).sort())).join(', '));
    }
  }

  public closeModal(contentCreditsModal) {
    contentCreditsModal.deny();
    this.close.emit();
  }
}
