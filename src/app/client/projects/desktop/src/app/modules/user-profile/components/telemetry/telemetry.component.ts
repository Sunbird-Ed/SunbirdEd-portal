import { takeUntil, filter } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { TelemetryService, IImpressionEventInput } from '@sunbird/telemetry';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { TelemetryActionsService } from './../../../offline/services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { ITelemetryInfo } from '../../interfaces';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.scss']
})
export class TelemetryComponent implements OnInit, OnDestroy {
  telemetryInfo: ITelemetryInfo;
  public telemetryImpression: IImpressionEventInput;
  public unsubscribe$ = new Subject<void>();
  disableExport = true;
  exportedTime;
  constructor(
    private telemetryActionService: TelemetryActionsService,
    public resourceService: ResourceService,
    private toasterService: ToasterService,
    private telemetryService: TelemetryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.router.events
    .pipe(filter((event) => event instanceof NavigationStart), takeUntil(this.unsubscribe$))
    .subscribe(x => {this.setPageExitTelemtry(); });
    this.getTelemetryInfo();
    this.setTelemetryImpression();
  }

  getTelemetryInfo() {
    this.telemetryActionService.getTelemetryInfo().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.telemetryInfo = _.get(data, 'result.response');
      this.disableExport = !this.telemetryInfo['totalSize'];
    }, (err) => {
      this.disableExport = true;
      this.toasterService.error(this.resourceService.messages.emsg.desktop.telemetryInfoEMsg);
    });
  }

  exportTelemetry() {
    this.disableExport = true;
    this.logTelemetry('export-telemetry');
    this.telemetryActionService.exportTelemetry().pipe(takeUntil(this.unsubscribe$)).subscribe(
      (data) => {
        this.getTelemetryInfo();
        this.toasterService.success(this.resourceService.messages.smsg.desktop.telemetryExportSMsg);
      },
      (err) => {
        this.disableExport = !this.telemetryInfo['totalSize'];
        if (err.error.responseCode !== 'NO_DEST_FOLDER') {
          this.toasterService.error(this.resourceService.messages.emsg.desktop.telemetryExportEMsg);
        }
      }
    );
  }

  setTelemetryImpression () {
    this.telemetryImpression = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'telemetry'
      },
      edata: {
        type: 'view',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid'),
        uri: this.router.url
      }
    };
  }
  setPageExitTelemtry() {
    this.telemetryImpression.edata.subtype = 'pageexit';
  }

  logTelemetry(id) {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'telemetry',
        cdata: []
      },
      edata: {
        id: id,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid'),
        extra: {
          size: this.telemetryInfo['totalSize'],
        }
      }
    };
    this.telemetryService.interact(interactData);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
