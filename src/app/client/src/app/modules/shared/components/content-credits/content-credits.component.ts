import {
  Component, OnInit, Input, EventEmitter, Output
} from '@angular/core';
import { ResourceService } from '../../services/index';

@Component({
  selector: 'app-content-credits',
  templateUrl: './content-credits.component.html'
})
export class ContentCreditsComponent implements OnInit {
   /**
   * To show / hide modal
  */
  showContentCreditModal = false;
  /**
  *input for content credits;
  */
  @Input() contentCreditsData: any;
  /**
  *Output for close popup;
  */
  @Output() close = new EventEmitter<any>();
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

  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
  }
  public closeModal(contentCreditsModal) {
    contentCreditsModal.deny();
    this.close.emit();
  }
}
