import { Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../services';
import { ElectronDialogService } from './../../services';
@Component({
  selector: 'app-connection-status',
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.scss']
})
export class ConnectionStatusComponent implements OnInit {
  isConnected = navigator.onLine;
  status = this.isConnected ? 'ONLINE' : 'OFFLINE';

   constructor(private connectionService: ConnectionService,
    public resourceService: ResourceService,
    public electronDialogService: ElectronDialogService,
    public router: Router) { }

   ngOnInit() {
    this.checkConnectionStatus();
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }

  checkConnectionStatus() {
    this.checkConnectionStatus();
    this.isConnected = !this.isConnected && this.router.url.includes('browse');
  }

  handleImport() {
    this.electronDialogService.showContentImportDialog();
  }

  navigateToBrowse() {
    this.router.navigate(['/browse']);
  }

}
