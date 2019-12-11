import { ResourceService } from '@sunbird/shared';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../services';
import { ElectronDialogService } from './../../services';
@Component({
  selector: 'app-no-content',
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.scss']
})
export class NoContentComponent implements OnInit {
  isConnected = navigator.onLine;
  showModal = false;

  constructor(
    public router: Router,
    public connectionService: ConnectionService,
    public resourceService: ResourceService,
    public electronDialogService: ElectronDialogService
  ) {}

  ngOnInit() {
    this.checkConnectionStatus();
    this.connectionService.monitor().subscribe(isConnected => {

      this.isConnected = isConnected;
      this.checkConnectionStatus();
    });
  }

  checkConnectionStatus() {
    this.isConnected = !this.isConnected && this.router.url.includes('browse');
  }

  handleImport() {
    this.electronDialogService.showContentImportDialog();
  }

  handleModal() {
    this.showModal = !this.showModal;
  }

}
