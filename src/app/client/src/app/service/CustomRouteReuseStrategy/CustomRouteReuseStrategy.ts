import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import * as _ from 'lodash-es';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private handlers: { [key: string]: DetachedRouteHandle } = {};

  /**
   * Determines if this route (and its subtree) should be detached to be reused later
   */
  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // console.log('reuse checking if this route should be re used or not', route);
    if ( _.get(route.routeConfig, 'data.routeReuse.reuse') && _.get(route.routeConfig, 'data.routeReuse.path')) {
      return true;
    }
    return false;
  }
  /**
   * Stores the detached route.
   */
  public store(route: ActivatedRouteSnapshot, handler: DetachedRouteHandle ): void {
    // console.log('reuse storing handler');
    const pathAsKey = this.getUrl(route);
    if (handler && pathAsKey) {
      this.handlers[pathAsKey] = handler;
    }
  }

  /**
   * Determines if this route (and its subtree) should be reattached
   */
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!this.handlers[this.getUrl(route)];
  }

  /**
   * Retrieves the previously stored route
   */
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return this.handlers[this.getUrl(route)];
  }

  /**
   * Determines if a route should be reused
   */
  public shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
    if ( _.get(future.routeConfig, 'data.routeReuse.reuse') && _.get(future.routeConfig, 'data.routeReuse.path')) {
      return true;
    }
    return (future.routeConfig === current.routeConfig); // Default reuse strategy by angular based on the following condition
  }

  /**
   * Returns a url for the current route from router data
   */
  private getUrl(route: ActivatedRouteSnapshot): string {
    return _.get(route.routeConfig, 'data.routeReuse.path');
  }
}
