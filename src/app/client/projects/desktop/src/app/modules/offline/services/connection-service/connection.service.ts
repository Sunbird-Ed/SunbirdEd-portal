import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import * as _ from 'lodash-es';
 @Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private connectionMonitor: Observable<boolean>;


   constructor() {
     this.connectionMonitor = new Observable((observer) => {
      observer.next(navigator.onLine);
      fromEvent(window, 'online').subscribe(data => {
        observer.next(true);
      });
      fromEvent(window, 'offline').subscribe(data => {
        observer.next(false);
      });
    });
   }

   monitor(): Observable<boolean> {
    return this.connectionMonitor;
  }

}
