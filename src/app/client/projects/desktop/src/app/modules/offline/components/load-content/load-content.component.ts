import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ConnectionService } from '../../services';
import { ElectronDialogService } from './../../services';
import { ResourceService } from '@sunbird/shared';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-load-content',
  templateUrl: './load-content.component.html',
  styleUrls: ['./load-content.component.scss']
})
export class LoadContentComponent implements OnInit {
  @ViewChild('modal') modal;
  isConnected = navigator.onLine;
  selectedValue;
  @Output() close = new EventEmitter();
  onlineMsg: string;
  addImportFontWeight;
  instance: string;
  constructor(
    public router: Router,
    private connectionService: ConnectionService,
    public resourceService: ResourceService,
    public electronDialogService: ElectronDialogService
  ) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.msgToShow();
    this.addCss();
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      this.msgToShow();
      this.addCss();
    });
  }

  handleImport() {
    this.electronDialogService.showContentImportDialog();
  }

  onChange(event) {
    this.selectedValue = event;
    event === 'import' ? document.getElementById('online')['checked'] = false : document.getElementById('offline')['checked'] = false;
    this.addCss();
  }

  msgToShow() {
    this.isConnected ? this.selectedValue = 'browse' : this.selectedValue = 'import';

  }
  closeModal() {
    this.close.emit();
    this.modal.deny();
  }
  handleModalData() {
    this.selectedValue === 'browse' ? this.router.navigate(['/browse']) : this.handleImport();
    this.modal.deny();
  }
  addCss() {
    this.selectedValue === 'import' ? this.addImportFontWeight = true : this.addImportFontWeight = false;
  }
}
