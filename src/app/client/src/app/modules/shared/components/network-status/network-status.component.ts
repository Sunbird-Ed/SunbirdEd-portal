import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResourceService, ConnectionService } from '../../services';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-network-status',
  templateUrl: './network-status.component.html',
  styleUrls: ['./network-status.component.scss']
})
export class NetworkStatusComponent implements OnInit, OnDestroy {
  isConnected = false;
  public unsubscribe$ = new Subject<void>();
  showLoadContentModal: any;
  constructor(public resourceService: ResourceService,
    private connectionService: ConnectionService) { }

  ngOnInit() {
    this.connectionService.monitor().pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
