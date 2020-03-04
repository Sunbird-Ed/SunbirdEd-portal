import { TelemetryService } from '@sunbird/telemetry';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ConnectionService } from '../../services';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit, OnDestroy {

  @Input() text: any;
  isConnected;
  @Output() navigate = new EventEmitter();
  public unsubscribe$ = new Subject<void>();
  constructor(private connectionService: ConnectionService,
    public resourceService: ResourceService,
    public activatedRoute: ActivatedRoute,
    public telemetryService: TelemetryService,
    public router: Router) { }

   ngOnInit() {
    this.connectionService.monitor().pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }

  isBrowsePage() {
    return  _.includes(this.router.url, 'browse');
  }
  handleRoute() {
    this.navigate.emit();
    this.setTelemetryData();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  setTelemetryData() {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'browse',
        cdata: []
      },
      edata: {
        id: 'navigate-' + _.kebabCase(_.get(this.text, 'linkName')),
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid')
      }
    };
    this.telemetryService.interact(interactData);
  }

}
