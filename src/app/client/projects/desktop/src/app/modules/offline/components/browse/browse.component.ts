import { Component, OnInit } from '@angular/core';
import { ConnectionService } from './../../services/connection-service/connection.service';
import { ActivatedRoute } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

  isConnected = navigator.onLine;
  public unsubscribe$ = new Subject<void>();

  constructor(private connectionService: ConnectionService, public resourceService: ResourceService) {
  }

  ngOnInit() {
    this.connectionService.monitor()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isConnected => {
        this.isConnected = isConnected;
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
