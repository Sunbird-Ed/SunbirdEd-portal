import { Component, OnInit, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
@Component({
  selector: 'app-footer',
  templateUrl: './main-footer.component.html'
})
export class MainFooterComponent implements OnInit {
  /**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;
  /*
  Date to show copyright year
  */
  date = new Date();
  /*
  Hide or show footer
  */
  showFooter = true;

  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
  }

}
