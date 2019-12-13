import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ConnectionService } from '../../services';
import { Subject } from 'rxjs';

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
    public router: Router) { }

   ngOnInit() {
    this.connectionService.monitor().pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
