import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupControlService {

  public popupSource = new BehaviorSubject(null);
  checkPopupStatus = this.popupSource.asObservable();

  constructor() { }

  changePopupStatus(value: boolean) {
    this.popupSource.next(value);
  }

}
