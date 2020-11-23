import { takeUntil, filter } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { TelemetryService, IImpressionEventInput } from '@sunbird/telemetry';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { TelemetryActionsService } from './../../../offline/services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { ITelemetryInfo } from '../../interfaces';
import { debounceTime } from 'rxjs/operators';
import { ConnectionService } from '../../services';
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
  syncStatus: any;
  disableSync = true;
  showSyncStatus = false;
  isConnected: any;
  exportedTime;
  forceSyncInfo: any;
  constructor(
    private telemetryActionService: TelemetryActionsService,
    public resourceService: ResourceService,
    private toasterService: ToasterService,
    private telemetryService: TelemetryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public connectionService: ConnectionService
  ) { }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart), takeUntil(this.unsubscribe$))
      .subscribe(x => { this.setPageExitTelemtry(); });
    this.getTelemetryInfo();
    this.setTelemetryImpression();
    // this event will start when import new telemetry file and status is completed
    this.telemetryActionService.telemetryImportEvent
      .pipe(debounceTime(1000), takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.getTelemetryInfo();
      });
    this.getSyncStatus();
    this.checkOnlineStatus();
  }

  getTelemetryInfo() {
    this.telemetryActionService.getTelemetryInfo().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.telemetryInfo = _.get(data, 'result.response');
      this.disableExport = !this.telemetryInfo['totalSize'];
      this.disableSync = !this.telemetryInfo['totalSize'];
      this.forceSyncInfo = _.find(_.get(data, 'result.response.networkInfo.forceSyncInfo'), { type: 'TELEMETRY' });
    }, (err) => {
      this.disableExport = true;
      this.toasterService.error(this.resourceService.messages.emsg.desktop.telemetryInfoEMsg);
    });
  }
  getSyncStatus() {
    this.telemetryActionService.getSyncTelemetryStatus().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.syncStatus = _.get(data, 'result.enable');
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
  setTelemetrySyncStatus(syncStatus) {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'telemetry',
        cdata: []
      },
      edata: {
        id: 'telemetry_sync_status' + syncStatus,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid'),
        extra: {}
      }
    };
    this.telemetryService.interact(interactData);
  }
  handleSyncStatus(syncStatus) {
    this.setTelemetrySyncStatus(syncStatus);
    const data = {
      'request': {
        'enable': syncStatus
      }
    };
    this.telemetryActionService.updateSyncStatus(data).pipe(takeUntil(this.unsubscribe$)).subscribe((response) => {});
  }

  checkOnlineStatus() {
    this.connectionService.monitor().pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {this.isConnected = isConnected; });
  }
  syncTelemetry() {
    this.setSyncTelemetry();
    if (this.isConnected) {
      const data  = {
        'request': {
          'type': ['TELEMETRY']
        }
      };
      this.showSyncStatus = true;
      this.disableSync = true;
      this.telemetryActionService.syncTelemtry(data).pipe(takeUntil(this.unsubscribe$)).subscribe(response => {
        this.showSyncStatus = false;
        this.getTelemetryInfo();
      }, (err) => {
        this.showSyncStatus = false;
        this.disableSync = false;
        this.toasterService.error(this.resourceService.messages.emsg.desktop.telemetrySyncError);
      });
    } else {
      this.toasterService.error(this.resourceService.messages.emsg.desktop.connectionError);
    }

  }

  setSyncTelemetry() {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'telemetry',
        cdata: []
      },
      edata: {
        id: 'sync_telemetry',
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid'),
        extra: {
          size: this.telemetryInfo['totalSize'],
        }
      }
    };
    this.telemetryService.interact(interactData);
  }
  setTelemetryImpression() {
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
