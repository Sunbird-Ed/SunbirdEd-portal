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
        if (modalvalue) {
          this.showFrameWorkPopUp = true;
        } else {
          this.showFrameWorkPopUp = false;
        }
        break;
      case 'showTermsAndCondPopUp':
        if (modalvalue) {
          this.showTermsAndCondPopUp = true;
        } else {
          this.showTermsAndCondPopUp = false;
        }
        break;
      case 'showUserVerificationPopup':
        if (modalvalue) {
          this.showUserVerificationPopup = true;
        } else {
          this.showUserVerificationPopup = false;
        }
        break;
      case 'isLocationConfirmed':
        if (modalvalue) {
          this.isLocationConfirmed = true;
        } else {
          this.isLocationConfirmed = false;
        }
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
