import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import * as _ from 'lodash';
/**
 * Service to redirect to parent component
 *
 */
@Injectable()
export class RouterNavigationService {
  /**
   * To navigate to other pages
   */
  route: Router;
  /**
   * Contains parent url
   */
  parentUrl: string;
  /**
   * Constructor - default method of RouterNavigationService class
   *
   * @param {Router} route Router reference
   */
  constructor(route: Router) {
    this.route = route;
  }
  /**
 * This method acceptes the activated route snapshot as parameter
 * and detects the parent url, constructs it and
 * helps to redirect to the parent page
 *
     * @param {any} activatedRoute whole object of activated route
 */
  navigateToParentUrl(activatedRoute: ActivatedRouteSnapshot): void {
    const urlArray = [];
    _.each(activatedRoute.parent.url, (key) => {
      urlArray.push(key.path);
    });
    this.parentUrl = _.join(urlArray, '/');
    this.route.navigate([this.parentUrl], { queryParams: activatedRoute.queryParams });
  }
}
