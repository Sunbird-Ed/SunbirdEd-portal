import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { ResourceService } from './../../services';
import { environment } from '@sunbird/environment';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-offline-banner',
  templateUrl: './offline-banner.component.html',
  styleUrls: ['./offline-banner.component.scss']
})
export class OfflineBannerComponent implements OnInit {

  /* to get the slug from explore-component*/
  @Input() slug: string;

  showBanner: boolean;

  public pageId: string;
  instance: string;
  /* list of states for which banner to be shown */
  public orgList = (<HTMLInputElement>document.getElementById('offlineDesktopAppTenant')) ?
    (<HTMLInputElement>document.getElementById('offlineDesktopAppTenant')).value.toLowerCase().split(',') : [];

  /* stores the offline desktop app version from envHelper variable */
  public desktopAppVersion = (<HTMLInputElement>document.getElementById('offlineDesktopAppVersion')) ?
    (<HTMLInputElement>document.getElementById('offlineDesktopAppVersion')).value : '';

    /* stores the offline desktop download url from envHelper variable */
  public appDownloadUrl = (<HTMLInputElement>document.getElementById('offlineDesktopAppDownloadUrl')) ?
    (<HTMLInputElement>document.getElementById('offlineDesktopAppDownloadUrl')).value : '';

  public isOffline: boolean = environment.isOffline;

  constructor(public router: Router, public resourceService: ResourceService, public activatedRoute: ActivatedRoute) {
    this.pageId = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
  }

  ngOnInit() {
    this.showOfflineBanner();
    this.instance = _.upperCase(this.resourceService.instance);
  }

  /** determines whether to show the banner for offline desktop apk download or not */
  showOfflineBanner() {
    if (this.orgList.includes(_.lowerCase(this.slug))) {
      this.showBanner = true;
    } else {
      this.showBanner = false;
    }
  }

  /* navigate to apk download page */
  navigateToDownloadApkPage() {
    const path = this.slug ? this.slug + '/download/desktopapp' : 'download/desktopapp';
    this.router.navigate([path]);
  }

}
