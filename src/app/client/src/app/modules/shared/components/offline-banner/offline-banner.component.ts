import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { distinctUntilChanged, map, takeUntil, debounceTime } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { ResourceService } from './../../services';
import { environment } from '@sunbird/environment';

@Component({
  selector: 'app-offline-banner',
  templateUrl: './offline-banner.component.html',
  styleUrls: ['./offline-banner.component.scss']
})
export class OfflineBannerComponent implements OnInit {

  /* to get the slug from explore-component*/
  @Input() slug: string;

  showBanner: boolean;

  /* toggling the css class */
  toggleStyle: boolean;

  public unsubscribe = new Subject<void>();

  /* list of states for which banner to be shown */
  public orgList = (<HTMLInputElement>document.getElementById('offlineDesktopAppTenant')) ?
  (<HTMLInputElement>document.getElementById('offlineDesktopAppTenant')).value.toLocaleLowerCase().split(',') : [];

  /* stores the offline desktop app version from envHelper variable */
  public desktopAppVersion = (<HTMLInputElement>document.getElementById('offlineDesktopAppVersion')) ?
  (<HTMLInputElement>document.getElementById('offlineDesktopAppVersion')).value : '';

  public isOffline: boolean = environment.isOffline;

  constructor(public router: Router, public resourceService: ResourceService) { }

  /** determines whether to show the banner for offline desktop apk download or not */
  ngOnInit() {
    if (this.orgList.includes(this.slug)) {
      this.showBanner = true;
    } else {
      this.showBanner = false;
    }
  }

  ngAfterViewInit() {
    const downscroll$ = fromEvent(window, 'scroll').pipe(
      debounceTime(10),
      map((scrollHeight) => (window.scrollY)),
      distinctUntilChanged(),
      map((windowHeight) => ((window.innerHeight + window.scrollY) > (document.body.scrollHeight - 318)))
    );
    const goingDown$ = downscroll$.pipe(takeUntil(this.unsubscribe));
    goingDown$.subscribe((val) => {
      if ((val)) {
        this.toggleStyle = false;
      } else {
        this.toggleStyle = true;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /* navigate to apk download page */
  navigateToDownloadApkPage() {
    this.router.navigate(['download-apk']);
  }

}
