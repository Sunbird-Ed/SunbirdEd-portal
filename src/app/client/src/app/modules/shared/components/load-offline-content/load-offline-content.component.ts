import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ElectronService } from '../../../core/services/electron/electron.service';
import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy, Input } from '@angular/core';
import { ResourceService, ConnectionService, ConfigService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata } from '@sunbird/telemetry';
@Component({
  selector: 'app-load-offline-content',
  templateUrl: './load-offline-content.component.html',
  styleUrls: ['./load-offline-content.component.scss']
})
export class LoadOfflineContentComponent implements OnInit, OnDestroy  {
  @Input() hideLoadButton = false;
  showLoadContentModal: any;
  @ViewChild('modal', {static: false}) modal;
  isConnected;
  selectedValue;
  onlineMsg: string;
  addImportFontWeight;
  instance: string;
  public unsubscribe$ = new Subject<void>();
  cancelTelemetryInteractEdata: IInteractEventEdata;
  continueTelemetryInteractEdata: IInteractEventEdata;

  constructor(
    public router: Router,
    private connectionService: ConnectionService,
    public resourceService: ResourceService,
    public activatedRoute: ActivatedRoute,
    public configService: ConfigService,
    public electronService: ElectronService
  ) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.connectionService.monitor().pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
      this.isConnected = isConnected;
      this.selectedValue = this.isConnected ? 'browse' : 'import';
      this.addFontWeight();
      this.setTelemetryData();
    });
    if (this.hideLoadButton) {
      this.handleImportContentDialog();
    }
  }

  openImportContentDialog() {
    this.electronService.get({url : this.configService.urlConFig.URLS.ELECTRON_DIALOG.CONTENT_IMPORT}).subscribe(response => {
      console.log('import dialog box opened', response);
    }, error => {
      console.log('error while showing import dialog box');
    });
  }

  onChange(event) {
    this.selectedValue = event;
    event === 'import' ? document.getElementById('online')['checked'] = false : document.getElementById('offline')['checked'] = false;
    this.addFontWeight();
    this.setTelemetryData();
  }

  closeModal() {
    this.selectedValue = this.isConnected ? 'browse' : 'import';
    this.showLoadContentModal = false;
  }

  navigate() {
    this.selectedValue === 'browse' ? this.router.navigate(['/explore/1'], { queryParams: { selectedTab: 'all' }}) : this.openImportContentDialog();
    this.modal.deny();
  }
  addFontWeight() {
    this.addImportFontWeight =  this.selectedValue === 'import' ? true : false;
  }

  setTelemetryData() {
    this.cancelTelemetryInteractEdata = {
      id: 'cancel-load-content',
      type: 'click',
      pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid')
    };
    this.continueTelemetryInteractEdata = {
      id: 'load-content-from-' + this.selectedValue,
      type: 'click',
      pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid')
    };
  }

  handleImportContentDialog() {
    this.showLoadContentModal = !this.showLoadContentModal;
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
