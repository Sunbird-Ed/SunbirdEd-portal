import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable()
export class NavigationHelperService {
  private history = [];
  constructor(private router: Router) {
    this.loadRouting();
  }

  public loadRouting(): void {
    // this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(({urlAfterRedirects}: NavigationEnd) => {
    //     this.history = [...this.history, urlAfterRedirects];
    // });
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(urlAfterRedirects => {
      this.history = [...this.history, urlAfterRedirects];
    });
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || 'home';
  }

}
