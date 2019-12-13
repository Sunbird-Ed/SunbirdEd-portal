import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ResourceService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConnectionService } from '../../services';
import { ElectronDialogService } from './../../services';
import * as _ from 'lodash-es';
import { TelemetryService } from '@sunbird/telemetry';
@Component({
  selector: 'app-no-content',
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.scss']
})
export class NoContentComponent implements OnInit, OnDestroy {
  isConnected;
  showModal = false;
  public unsubscribe$ = new Subject<void>();

  constructor(
    public router: Router,
    public connectionService: ConnectionService,
    public resourceService: ResourceService,
    private electronDialogService: ElectronDialogService,
    public activatedRoute: ActivatedRoute,
    public telemetryService: TelemetryService
  ) {}

  ngOnInit() {

    this.connectionService.monitor().pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }

  isBrowsePage() {
    return  _.includes(this.router.url, 'browse');
  }

  openImportContentDialog() {
    this.electronDialogService.showContentImportDialog();
    this.addInteractEvent();
  }

  handleModal() {
    this.showModal = !this.showModal;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setTelemetryData () {
    return {
      id: 'load-content',
      type: 'click',
      pageid:  _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid')
    };
  }

  addInteractEvent() {
    const interactData = {
      context: {
        env: 'browse-online',
        cdata: []
      },
      edata: {
        id: 'load-content',
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid')
      }
    };
    this.telemetryService.interact(interactData);
  }

}
