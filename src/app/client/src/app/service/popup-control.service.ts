import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupControlService {

  public frameworkPopup = false;
  public termsAndCondPopup = false;
  public userVerificationPopup = false;
  public locationPopup = false;

  public popupSource = new BehaviorSubject(null);
  checkPopupStatus = this.popupSource.asObservable();

  constructor() { }

  changePopupStatus(modalkey: string, modalvalue: boolean) {
    switch (modalkey) {
      case 'frameworkPopup':
        this.frameworkPopup = modalvalue;
        break;
      case 'termsAndCondPopup':
        this.termsAndCondPopup = modalvalue;
        break;
      case 'userVerificationPopup':
        this.userVerificationPopup = modalvalue;
        break;
      case 'locationPopup':
        this.locationPopup = modalvalue;
        break;
    }
    if (!this.frameworkPopup
      && !this.termsAndCondPopup
      && !this.userVerificationPopup
      && !this.locationPopup) {
        this.popupSource.next(true);
    } else {
      this.popupSource.next(false);
    }
  }

}
