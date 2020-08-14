import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {ResourceService, NavigationHelperService, COLUMN_TYPE, LayoutService} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-get',
  templateUrl: './get.component.html',
  styleUrls: ['./get.component.scss']
})
export class GetComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  /**
   * reference of ResourceService
   */
  public resourceService: ResourceService;
  /**
   * used to store insatnce name
   */
  public instanceName;
  /**
   * used to store searched keyword
   */
  public searchKeyword;
  /**
  * To navigate to other pages
   */
  public router: Router;
  instance: string;
  layoutConfiguration: any;
  public unsubscribe$ = new Subject<void>();

  constructor(resourceService: ResourceService, router: Router, public activatedRoute: ActivatedRoute,
    public navigationhelperService: NavigationHelperService, public layoutService: LayoutService) {
    this.resourceService = resourceService;
    this.router = router;
  }

  ngOnInit() {
    EkTelemetry.config.batchsize = 2;
    this.instance = _.upperCase(this.resourceService.instance);
    this.initLayout();
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }

  ngAfterViewInit () {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: this.router.url,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
    });
  }

  public navigateToSearch() {
    sessionStorage.removeItem('l1parent');  // l1parent value is removed (SB-19982)
    if (this.searchKeyword) {
      this.router.navigate(['/get/dial', _.trim(this.searchKeyword)]);
    }
  }
  ngOnDestroy() {
    EkTelemetry.config.batchsize = 10;
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
