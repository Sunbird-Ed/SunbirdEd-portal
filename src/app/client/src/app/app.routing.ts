import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { InViewWrapperService, TelemetryService, IImpressionEventInput } from '@sunbird/core';

const appRoutes: Routes = [
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  /**
   * activatedRoute - reference of 'ActivatedRoute'
   */
  public activatedRoute: ActivatedRoute;
  /**
   * router - reference of 'Router'
   */
  public router: Router;

  /**
   * telemetryService - reference of 'TelemetryService'
   */
  public telemetryService: TelemetryService;

  /**
   * inViewWrapperService - reference of 'InViewWrapperService'
   */
  public inViewWrapperService: InViewWrapperService;

  /**
   * constructor
   * @param activatedRoute
   * @param router
   * @param telemetryService
   * @param inViewWrapperService
   */
  constructor(activatedRoute: ActivatedRoute, router: Router, telemetryService: TelemetryService,
    inViewWrapperService: InViewWrapperService) {
    this.activatedRoute = activatedRoute;
    this.router = router;
    this.telemetryService = telemetryService;
    this.inViewWrapperService = inViewWrapperService;

    // subscribe to route navigation event and fire impression on route changes
    this.router.events.filter(event => event instanceof NavigationStart).subscribe(event => {
      let currentRoute = this.activatedRoute.root;
      let routeData: any;
      while (currentRoute.children.length > 0) {
        const child: ActivatedRoute[] = currentRoute.children;
        child.forEach(route => {
          currentRoute = route;
          routeData = route.snapshot.data;
          // if object data set in 'routes' data get the id of object using 'object.idParam'
          if (routeData.object) {
            routeData.object.id = route.snapshot.params[routeData.object.idParam]; // get value of id from 'idParam'
          } else {
            routeData.object = {};
          }
        });
      }
      if (routeData) {
        this.sendTelemetryImpression(routeData);
      }
    });
  }
  /**
   * method to send telemtry impression data
   * @param data route data needed for telemetry
   */
  private sendTelemetryImpression(data) {
    const iImpressionEventInput: IImpressionEventInput = {
      context: {
        env: data.env
      },
      edata: {
        pageid: data.pageid,
        type: data.type,
        subtype: data.subtype,
        uri: this.router.url,
        visits: this.inViewWrapperService.getInviewData()
      },
      object: {
        id: data.object.id,
        type: data.object.type,
        ver: data.object.ver,
        rollup: data.object.rollup
      }
    };
    this.telemetryService.impression(iImpressionEventInput);
    // clear inview logs
    this.inViewWrapperService.inViewLogs = [];
  }

}

