import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class SignupGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      const enableSignup: string = (<HTMLInputElement>document.getElementById('enableSignup')) ?
    (<HTMLInputElement>document.getElementById('enableSignup')).value : 'true';
    if (enableSignup.toLowerCase() !== 'true') {
      window.location.replace(window.location.origin);
    }
    return (enableSignup.toLowerCase() === 'true');
  }
}
