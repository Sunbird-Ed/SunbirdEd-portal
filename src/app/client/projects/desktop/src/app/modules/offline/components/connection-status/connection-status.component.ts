import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConnectionService } from '../../services';
import { Subject } from 'rxjs';
import { IInteractEventEdata } from '@sunbird/telemetry';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-connection-status',
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.scss']
})
export class ConnectionStatusComponent implements OnInit, OnDestroy {
  isConnected;
  public unsubscribe$ = new Subject<void>();
  importTelemetryInteractEdata: IInteractEventEdata;
  browseTelemetryInteractEdata: IInteractEventEdata;
  showLoadContentModal: any;
   constructor(private connectionService: ConnectionService,
    public resourceService: ResourceService,
    public activatedRoute: ActivatedRoute,
    public router: Router) { }

   ngOnInit() {
    this.connectionService.monitor().pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
      this.isConnected = isConnected;
    });
    this.setTelemetryData();
  }

  handleImportContentDialog() {
    this.showLoadContentModal = !this.showLoadContentModal;
  }

  setTelemetryData() {
    this.importTelemetryInteractEdata = {
      id: 'import-content',
      type: 'click',
      pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid')
    };
    this.browseTelemetryInteractEdata = {
      id: 'browse-content',
      type: 'click',
      pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid')
    };
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
