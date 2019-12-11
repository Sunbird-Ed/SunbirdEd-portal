import { Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConnectionService } from '../../services';
import { ElectronDialogService } from './../../services';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {

  @Input() text: any;
  isConnected = navigator.onLine;
  @Output() navigate = new EventEmitter();
  constructor(private connectionService: ConnectionService,
    public resourceService: ResourceService,
    public electronDialogService: ElectronDialogService,
    public router: Router) { }

   ngOnInit() {
    this.checkConnectionStatus();
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      this.checkConnectionStatus();
    });
  }

  checkConnectionStatus() {
    this.isConnected = this.isConnected && this.router.url.includes('browse');
  }
  handleRoute() {
    this.navigate.emit();
  }


}
