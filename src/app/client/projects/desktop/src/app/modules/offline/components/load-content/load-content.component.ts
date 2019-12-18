import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { ConnectionService } from '../../services';
import { ElectronDialogService } from './../../services';
import { ResourceService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  selector: 'app-load-content',
  templateUrl: './load-content.component.html',
  styleUrls: ['./load-content.component.scss']
})
export class LoadContentComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal;
  isConnected;
  selectedValue;
  @Output() close = new EventEmitter();
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
    private electronDialogService: ElectronDialogService,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.connectionService.monitor().pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
      this.isConnected = isConnected;
      this.selectedValue = this.isConnected ? 'browse' : 'import';
      this.addFontWeight();
      this.setTelemetryData();
    });
  }

  openImportContentDialog() {
    this.electronDialogService.showContentImportDialog();
  }

  onChange(event) {
    this.selectedValue = event;
    event === 'import' ? document.getElementById('online')['checked'] = false : document.getElementById('offline')['checked'] = false;
    this.addFontWeight();
    this.setTelemetryData();
  }

  closeModal() {
    this.close.emit();
    this.modal.deny();
  }

  navigate() {
    this.selectedValue === 'browse' ? this.router.navigate(['/browse']) : this.openImportContentDialog();
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
