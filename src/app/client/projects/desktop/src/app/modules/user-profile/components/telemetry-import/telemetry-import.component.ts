import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { ElectronDialogService } from '../../../offline/services';
import { TelemetryActionsService } from './../../../offline/services';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { TelemetryService } from '@sunbird/telemetry';
import { timer, Subject, combineLatest } from 'rxjs';
import { switchMap, map, filter, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-telemetry-import',
  templateUrl: './telemetry-import.component.html',
  styleUrls: ['./telemetry-import.component.scss']
})
export class TelemetryImportComponent implements OnInit, OnDestroy {
  importFilesList = [];
  public unsubscribe$ = new Subject<void>();
  importedFilesSize = 0;
  callImportList = false;
  apiCallSubject = new Subject();
  contentStatusObject = {};
  localStatusArr = ['inProgress', 'inQueue'];
  apiCallTimer = timer(1000, 3000).pipe(filter(data => !data || (this.callImportList)));
  constructor(public resourceService: ResourceService,
    public telemetryActionsService: TelemetryActionsService,
    private telemetryService: TelemetryService,
    public toasterService: ToasterService,
    private activatedRoute: ActivatedRoute,
    private electronDialogService: ElectronDialogService) {
      this.getList();
      document.addEventListener('telemetry:import', (event) => {
        this.apiCallSubject.next();
      });
     }

  ngOnInit() {
    this.apiCallSubject.next();
  }
  openImportTelemetryDialog() {
    this.setImportTelemetry();
    this.electronDialogService.showTelemetryImportDialog();
  }
  getList() {
    // tslint:disable-next-line: deprecation
    combineLatest(this.apiCallTimer, this.apiCallSubject, (data1, data2) => true)
      .pipe(takeUntil(this.unsubscribe$),  switchMap(() => this.telemetryActionsService.telemetryImportList()),
        map((resp: any) => {
          this.callImportList = false;
          _.forEach(_.get(resp, 'result.response.items'), (value) => {
            if (_.includes(this.localStatusArr, value.status)) {
              this.callImportList = true;
            }
          });
          return _.get(resp, 'result.response.items');
        })).subscribe((responseList: any) => {
          this.importFilesList = responseList;
          this.getTotalSizeImportedFiles();
        });
  }
  getTotalSizeImportedFiles() {
    this.importedFilesSize = 0;
    _.forEach(this.importFilesList, data => {
      if (data.status === 'completed') {
        this.importedFilesSize += data.totalSize;
      }
    });
  }
  setImportTelemetry() {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'telemetry',
        cdata: []
      },
      edata: {
        id: 'import_telemetry_file',
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid'),
        extra: {}
      }
    };
    this.telemetryService.interact(interactData);
  }
  reTryImport(fileDetails) {
    fileDetails['disable'] = true;
    this.setRetryImportTelemetry(fileDetails);
    this.telemetryActionsService.reTryTelemetryImport(fileDetails.id).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
    this.apiCallSubject.next();
    }, error => {
    this.apiCallSubject.next();
      this.toasterService.error(this.resourceService.messages.desktop.etmsg.telemetryImportError);
    });
  }
  setRetryImportTelemetry(fileDetails) {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'telemetry',
        cdata: []
      },
      edata: {
        id: fileDetails.id,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid'),
        extra: {
          size: fileDetails['totalSize'],
        }
      }
    };
    this.telemetryService.interact(interactData);
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
