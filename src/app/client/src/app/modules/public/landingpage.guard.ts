import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class LandingpageGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const defaultTenantIndexStatus: string = (<HTMLInputElement>document.getElementById('defaultTenantIndexStatus')) ?
      (<HTMLInputElement>document.getElementById('defaultTenantIndexStatus')).value : 'false';
      if (defaultTenantIndexStatus.toLowerCase() === 'true') {
        window.location.replace(window.location.origin);
      }
      return (defaultTenantIndexStatus.toLowerCase() !== 'true');
  }
}
