import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';

@Component({
  selector: 'app-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.css']
})
export class CreateContentComponent {

  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;


  /**
  * Constructor to create injected service(s) object
  *
  * Default method of DeleteComponent class

  * @param {ResourceService} resourceService Reference of ResourceService
 */
  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

 }
