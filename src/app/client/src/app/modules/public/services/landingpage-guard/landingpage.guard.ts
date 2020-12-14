import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '@sunbird/environment';
@Injectable()
export class LandingpageGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (environment.isDesktopApp) {
        this.router.navigate(['/mydownloads'], { queryParams: { selectedTab: 'mydownloads' }});
        return false;
      } else {
        const defaultTenantIndexStatus: string = (<HTMLInputElement>document.getElementById('defaultTenantIndexStatus')) ?
        (<HTMLInputElement>document.getElementById('defaultTenantIndexStatus')).value : 'false';
        if (defaultTenantIndexStatus.toLowerCase() === 'true') {
          window.location.replace(window.location.origin);
        }
        return (defaultTenantIndexStatus.toLowerCase() !== 'true');
      }
  }
}
