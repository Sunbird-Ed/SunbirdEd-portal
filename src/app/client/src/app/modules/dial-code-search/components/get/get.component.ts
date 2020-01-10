import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ResourceService, NavigationHelperService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
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

  constructor(resourceService: ResourceService, router: Router, public activatedRoute: ActivatedRoute,
    public navigationhelperService: NavigationHelperService) {
    this.resourceService = resourceService;
    this.router = router;
  }

  ngOnInit() {
    EkTelemetry.config.batchsize = 2;
    this.instance = _.upperCase(this.resourceService.instance);
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
    if (this.searchKeyword) {
      this.router.navigate(['/get/dial', _.trim(this.searchKeyword)]);
    }
  }
  ngOnDestroy() {
    EkTelemetry.config.batchsize = 10;
  }

}
