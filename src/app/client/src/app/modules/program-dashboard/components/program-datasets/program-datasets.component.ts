import { Component, OnInit } from '@angular/core';
import {ToasterService, NavigationHelperService, LayoutService,ResourceService} from '@sunbird/shared';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import {Subject} from 'rxjs';
import { TncService } from '@sunbird/core';
import {first, takeUntil} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-program-datasets',
  templateUrl: './program-datasets.component.html',
  styleUrls: ['./program-datasets.component.scss']
})
export class ProgramDatasetsComponent implements OnInit {

  public activatedRoute: ActivatedRoute;

  reportTypes = ["observation","observation2"];
  programs = ['School Development Program','Block Development Program'];
  solutions = ['School Observation form','Teaching improvement'];

  constructor(
    activatedRoute: ActivatedRoute,
    public layoutService: LayoutService,
    public telemetryService: TelemetryService,
    public resourceService: ResourceService
    ) {
        this.activatedRoute = activatedRoute;
      }


  layoutConfiguration: any;
  public unsubscribe$ = new Subject<void>();

  ngOnInit() {
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

}
