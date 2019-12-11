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
  isConnected;

   constructor(private connectionService: ConnectionService,
    public resourceService: ResourceService,
    private electronDialogService: ElectronDialogService,
    public router: Router) { }

   ngOnInit() {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }

  openImportContentDialog() {
    this.electronDialogService.showContentImportDialog();
  }

}
