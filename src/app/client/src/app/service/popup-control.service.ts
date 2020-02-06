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
    if (modalkey === 'showFrameWorkPopUp') {
      if (modalvalue) {
        this.showFrameWorkPopUp = true;
      } else {
        this.showFrameWorkPopUp = false;
      }
    }
    if (modalkey === 'showTermsAndCondPopUp') {
      if (modalvalue) {
        this.showTermsAndCondPopUp = true;
      } else {
        this.showTermsAndCondPopUp = false;
      }
    }
    if (modalkey === 'showUserVerificationPopup') {
      if (modalvalue) {
        this.showUserVerificationPopup = true;
      } else {
        this.showUserVerificationPopup = false;
      }
    }
    if (modalkey === 'isLocationConfirmed') {
      if (modalvalue) {
        this.isLocationConfirmed = true;
      } else {
        this.isLocationConfirmed = false;
      }
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
