import { ResourceService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import { ConnectionService } from './../../services/connection-service/connection.service';

 @Component({
  selector: 'app-network-status',
  templateUrl: './network-status.component.html',
  styleUrls: ['./network-status.component.scss']
})
export class NetworkStatusComponent implements OnInit {

   isConnected = navigator.onLine;
  status = this.isConnected ? 'ONLINE' : 'OFFLINE';

   constructor(private connectionService: ConnectionService,
    public resourceService: ResourceService) { }

   ngOnInit() {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = 'ONLINE';
      } else {
        this.status = 'OFFLINE';
      }
    });
  }
}
