import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConnectionService } from '../../services';
import { ElectronDialogService } from './../../services';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-connection-status',
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.scss']
})
export class ConnectionStatusComponent implements OnInit, OnDestroy {
  isConnected;
  public unsubscribe$ = new Subject<void>();

   constructor(private connectionService: ConnectionService,
    public resourceService: ResourceService,
    private electronDialogService: ElectronDialogService,
    public router: Router) { }

   ngOnInit() {
    this.connectionService.monitor().pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }

  openImportContentDialog() {
    this.electronDialogService.showContentImportDialog();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
