import { switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent, merge, of } from 'rxjs';
import * as _ from 'lodash-es';
 @Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private connectionMonitor = new BehaviorSubject<boolean>(navigator.onLine);
  isConnected = this.connectionMonitor.asObservable();

   constructor() {}

   monitor(): Observable<boolean> {
    return this.isConnected.pipe(switchMap(() => {
      return merge(of(navigator.onLine), fromEvent(window, 'online'), fromEvent(window, 'offline'));
    }),
    map(event => {
      return (event === true || _.isEqual(_.get(event, 'type'), 'online'));
    }));
  }
}
