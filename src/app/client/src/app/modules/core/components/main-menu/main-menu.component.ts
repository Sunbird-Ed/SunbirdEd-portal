import { ResourceService } from '@sunbird/shared';
import { Component , OnInit} from '@angular/core';
import { UserService, FrameworkService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
/**
 * Main menu component
 */
@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent  implements OnInit {
  /**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;
  /**
   * reference of UserService service.
   */
  public userService: UserService;
  /**
   * reference of Router.
   */
  private router: Router;
  categoryMasterList;
  /*
  * constructor

  */
  constructor(resourceService: ResourceService, userService: UserService, router: Router, private frameworkService: FrameworkService) {
    this.resourceService = resourceService;
    this.userService = userService;
    this.router = router;
  }

  ngOnInit() {
    this.frameworkService.initialize('');
    this.frameworkService.frameworkData$.subscribe((frameworkData) => {
      if (frameworkData && !frameworkData.err) {
        this.categoryMasterList = _.cloneDeep(frameworkData.frameworkdata);
      }
    });
  }

  filter(node, child) {
    console.log(node, '-', child);
    const queryParams = {};
    queryParams[node] = child;
    this.router.navigate(['search/catalog/1', {cat: node}], {queryParams: queryParams});
  }

}
