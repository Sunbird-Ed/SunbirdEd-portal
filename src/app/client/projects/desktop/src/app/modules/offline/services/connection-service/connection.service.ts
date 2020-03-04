import { Injectable } from '@angular/core';
import { Observable, fromEvent, Subject } from 'rxjs';
import * as _ from 'lodash-es';
 @Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private connectionMonitor: Observable<boolean>;

   constructor() {
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
