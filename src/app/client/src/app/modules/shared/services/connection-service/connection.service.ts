import { Injectable } from '@angular/core';
import { UtilService } from '../../services/util/util.service';
import * as _ from 'lodash-es';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private connectionMonitor: Observable<boolean>;

  constructor(public router: Router, public utilService: UtilService) {
    this.connectionMonitor = new Observable((observer) => {
      observer.next(navigator.onLine);
      window.addEventListener('offline', (e) => {
        observer.next(false);
      });
      window.addEventListener('online', (e) => {
        observer.next(true);
      });
    });
  }

  monitor(): Observable<boolean> {
    return this.connectionMonitor;
  }
}
