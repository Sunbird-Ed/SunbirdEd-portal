import { Injectable } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private connectionMonitor: Observable<boolean>;

  constructor(private toastService: ToasterService, private resourceService: ResourceService) {
    this.connectionMonitor = new Observable((observer) => {
      observer.next(navigator.onLine);
      window.addEventListener('offline', (e) => {
        observer.next(false);
      });
      window.addEventListener('online', (e) => {
        observer.next(true);
      });
    });

    this.notifyNetworkChange();
  }

  notifyNetworkChange() {
    this.connectionMonitor.pipe(debounceTime(5000)).subscribe((status: boolean) => {
      const message = status ? _.get(this.resourceService, 'messages.stmsg.desktop.onlineStatus') : _.get(this.resourceService, 'messages.emsg.desktop.offlineStatus');
      this.toastService.info(message);
    });
  }

  monitor(): Observable<boolean> {
    return this.connectionMonitor;
  }
}
