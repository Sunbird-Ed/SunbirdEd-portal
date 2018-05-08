import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { Router } from '@angular/router';
@Component({
  selector: 'app-get',
  templateUrl: './get.component.html',
  styleUrls: ['./get.component.css']
})
export class GetComponent implements OnInit {

  /**
   * reference of ResourceService
   */
  public resourceService: ResourceService;
  /**
   * used to store insatnce name
   */
  public instanceName;
  /**
   * used to store searched keyword
   */
  public searchKeyword;
  /**
  * To navigate to other pages
   */
  public router: Router;


  constructor(resourceService: ResourceService, router: Router) {
    this.resourceService = resourceService;
    this.router = router;
  }

  ngOnInit() {
    this.instanceName = this.resourceService.instance;
  }

  public navigateToSearch() {
    this.router.navigate(['/get/dial', this.searchKeyword]);
  }

}
