import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupControlService {

  public showFrameWorkPopUp = false;
  public showTermsAndCondPopUp = false;
  public showUserVerificationPopup = false;
  public isLocationConfirmed = true;

  public popupSource = new BehaviorSubject(null);
  checkPopupStatus = this.popupSource.asObservable();

  constructor() { }

  changePopupStatus(modalkey: string, modalvalue: boolean) {
    switch (modalkey) {
      case 'showFrameWorkPopUp':
        this.showFrameWorkPopUp = modalvalue;
        break;
      case 'showTermsAndCondPopUp':
        this.showTermsAndCondPopUp = modalvalue;
        break;
      case 'showUserVerificationPopup':
        this.showUserVerificationPopup = modalvalue;
        break;
      case 'isLocationConfirmed':
        this.isLocationConfirmed = modalvalue;
        break;
    }
    if (!this.showFrameWorkPopUp
      && !this.showTermsAndCondPopUp
      && !this.showUserVerificationPopup
      && this.isLocationConfirmed) {
        this.popupSource.next(true);
    } else {
      this.popupSource.next(false);
    }
  }

}
