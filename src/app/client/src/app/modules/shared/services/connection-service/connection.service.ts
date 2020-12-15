import { Injectable } from '@angular/core';
import { ResourceService } from '../../services/resource/resource.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { UtilService } from '../../services/util/util.service';
import * as _ from 'lodash-es';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private connectionMonitor: Observable<boolean>;

  constructor(private toastService: ToasterService, private resourceService: ResourceService,
    public router: Router, public utilService: UtilService) {
    this.connectionMonitor = new Observable((observer) => {
      observer.next(navigator.onLine);
      window.addEventListener('offline', (e) => {
        observer.next(false);
      });
      window.addEventListener('online', (e) => {
        observer.next(true);
      });
    });
    if(this.utilService.isDesktopApp) {
      this.notifyNetworkChange();
    }
  }

  notifyNetworkChange() {
    this.connectionMonitor.pipe(debounceTime(5000)).subscribe((status: boolean) => {
      const message = status ? _.get(this.resourceService, 'messages.stmsg.desktop.onlineStatus') : _.get(this.resourceService, 'messages.emsg.desktop.offlineStatus');
      this.toastService.info(message);
      if (!status && this.router.url.indexOf('mydownloads') <= 0) {
        this.router.navigate(['mydownloads'], { queryParams: { selectedTab: 'mydownloads' } });
      }
    });
  }

  monitor(): Observable<boolean> {
    return this.connectionMonitor;
  }
}
