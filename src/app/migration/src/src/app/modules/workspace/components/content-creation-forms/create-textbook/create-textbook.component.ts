import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-textbook',
  templateUrl: './create-textbook.component.html',
  styleUrls: ['./create-textbook.component.css']
})
export class CreateTextbookComponent implements OnInit {

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
  constructor(resourceService: ResourceService, private router: Router) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
  }
  goToCreate() {
    this.router.navigate(['/workspace/content/create']);
  }
}
